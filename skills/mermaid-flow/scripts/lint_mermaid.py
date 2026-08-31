#!/usr/bin/env python3
"""
lint_mermaid.py — heuristic linter for Mermaid diagrams.

Purpose: catch the things that make diagrams "messy" or wrong BEFORE a human sees
them. It is a heuristic — it does not fully parse Mermaid grammar. Its job is to
flag the smells that lead to crossing/overlapping edges and to structural mistakes,
so the author fixes them or consciously accepts them.

What it checks (flowchart / graph blocks):
  - node count per diagram        (too many -> split it)
  - edge/node density             (dense graphs auto-layout into spaghetti)
  - bidirectional edges           (<--> or A-->B plus B-->A: main cause of crossings)
  - self loops                    (A-->A: usually a typo or should be a note)
  - orphan nodes                  (declared but never connected)
  - subgraph without direction    (undirected subgraphs wander)
  - overlong node labels          (push width, force wraps)

It also (optionally) does a REAL syntax check by rendering with mermaid-cli.

Usage:
  python3 lint_mermaid.py FILE [FILE ...]          # lint .md (```mermaid fences) or .mmd
  python3 lint_mermaid.py FILE --render            # also render-check via npx mermaid-cli
  python3 lint_mermaid.py FILE --max-nodes 12      # tune the node-count threshold

Exit code: 0 = clean/warnings only, 1 = at least one ERROR (or render failure).
"""
import argparse
import re
import subprocess
import sys
import tempfile
from pathlib import Path

# Link operators, longest first so we strip greedily.
LINKS = [
    "<-->", "<==>", "o--o", "x--x", "<-.->",
    "-.->", "<-.-", "==>", "<==", "--o", "--x",
    "-->", "<--", "-.-", "===", "---",
]
# (pattern, replacement): strip edge-label TEXT but keep the bare link operator,
# otherwise the directional edge is lost and a real node looks orphaned.
LABEL_PATTERNS = [
    (re.compile(r"\|[^|]*\|"), " "),            # -->|label|  (pipe comes after operator)
    (re.compile(r"<-\.\s.*?\s\.->"), " <-.-> "),  # <-. text .->
    (re.compile(r"-\.\s.*?\s\.->"), " -.-> "),    # -. text .->
    (re.compile(r"<-\.\s.*?\s\.-"), " <-.- "),    # <-. text .-
    (re.compile(r"-\.\s.*?\s\.-"), " -.- "),      # -. text .-
    (re.compile(r"==\s.*?\s==>"), " ==> "),       # == text ==>
    (re.compile(r"--\s.*?\s-->"), " --> "),       # -- text -->
    (re.compile(r"--\s.*?\s---"), " --- "),       # -- text ---
]
NODE_ID = re.compile(r"^([A-Za-z0-9_]+)")
FLOW_HEADER = re.compile(r"^\s*(flowchart|graph)\b", re.I)
DIAGRAM_KEYWORDS = (
    "flowchart", "graph", "sequenceDiagram", "erDiagram", "stateDiagram",
    "stateDiagram-v2", "classDiagram", "gantt", "journey", "mindmap",
    "timeline", "pie", "C4Context", "C4Container", "quadrantChart",
)


def extract_blocks(text: str, path: str):
    """Yield (label, code) mermaid blocks. Markdown fences, or a raw .mmd file.

    A markdown file with no ```mermaid fence has nothing to lint — yield nothing,
    rather than treating the whole prose file as one diagram (which would make
    --render try to render the markdown and fail on a doc that has no diagram).
    Only a bare .mmd file is treated as a single unfenced diagram.
    """
    if "```mermaid" in text:
        for i, m in enumerate(re.finditer(r"```mermaid\s*\n(.*?)```", text, re.S)):
            yield f"{path} block#{i + 1}", m.group(1)
    elif path.endswith(".mmd"):
        yield path, text
    # else: a markdown/other file with no mermaid fence -> nothing to lint


def diagram_type(code: str) -> str:
    for line in code.splitlines():
        s = line.strip()
        if not s or s.startswith("%%"):
            continue
        for kw in DIAGRAM_KEYWORDS:
            if s.startswith(kw):
                return kw
        return "unknown"
    return "empty"


def strip_labels(line: str) -> str:
    for pat, repl in LABEL_PATTERNS:
        line = pat.sub(repl, line)
    return line


def parse_flow(code: str):
    """Return (nodes, directed_edges, has_subgraph, has_direction)."""
    nodes, edges = set(), []
    has_subgraph = has_direction = False
    for raw in code.splitlines():
        line = raw.strip()
        if not line or line.startswith("%%"):
            continue
        low = line.lower()
        if low.startswith("subgraph"):
            has_subgraph = True
            continue
        if low.startswith("direction"):
            has_direction = True
            continue
        if low in ("end",) or low.startswith(("style", "classdef", "class ", "click", "linkstyle")):
            continue
        if FLOW_HEADER.match(line):
            continue

        clean = strip_labels(line)
        # Split the line into a chain around link operators.
        pattern = "|".join(re.escape(op) for op in LINKS)
        parts = re.split(f"({pattern})", clean)
        if len(parts) < 3:  # no link on this line; maybe a lone node decl
            nid = node_ids(parts[0])
            nodes.update(nid)
            continue
        # Walk operator-separated tokens, recording directed edges.
        tokens = parts
        prev_nodes = node_ids(tokens[0])
        nodes.update(prev_nodes)
        j = 1
        while j + 1 < len(tokens):
            op = tokens[j]
            nxt = node_ids(tokens[j + 1])
            nodes.update(nxt)
            for a in prev_nodes:
                for b in nxt:
                    if op in ("<--", "<==", "<-.-"):
                        edges.append((b, a, op))
                    elif op in ("<-->", "<==>", "o--o", "x--x"):
                        edges.append((a, b, op))
                        edges.append((b, a, op))
                    else:
                        edges.append((a, b, op))
            prev_nodes = nxt
            j += 2
    return nodes, edges, has_subgraph, has_direction


def node_ids(token: str):
    """Extract node id(s) from a token; handles `A & B` fan syntax."""
    out = []
    for piece in token.split("&"):
        piece = piece.strip()
        if not piece or piece == "LINKSPLIT":
            continue
        m = NODE_ID.match(piece)
        if m:
            out.append(m.group(1))
    return out


def long_labels(code: str, limit=42):
    out = []
    for m in re.finditer(r"[\[\(\{]+\s*\"?(.*?)\"?\s*[\]\)\}]+", code):
        label = re.sub(r"<br\s*/?>", " ", m.group(1)).strip()
        if len(label) > limit:
            out.append(label[:limit] + "…")
    return out


def lint_flow(name, code, max_nodes):
    nodes, edges, has_sub, has_dir = parse_flow(code)
    errors, warns = [], []
    n, e = len(nodes), len(edges)

    if n > max_nodes:
        errors.append(f"{n} nodes (> {max_nodes}). Split this into focused sub-diagrams.")
    elif n > max_nodes - 4:
        warns.append(f"{n} nodes — near the {max_nodes} limit; consider splitting.")

    if n and e / max(n, 1) > 2.0:
        warns.append(f"edge/node ratio {e/n:.1f} (>2.0) — dense; layout may cross wires.")

    seen, bidir = set(), set()
    for a, b, op in edges:
        if op in ("<-->", "<==>", "o--o", "x--x"):
            bidir.add(frozenset((a, b)))
        if (b, a) in seen:
            bidir.add(frozenset((a, b)))
        seen.add((a, b))
        if a == b:
            warns.append(f"self-loop on '{a}' — usually a typo or belongs in a note.")
    for pair in bidir:
        p = tuple(pair)
        warns.append(f"bidirectional edge {p} — top cause of crossings; prefer one direction.")

    connected = {x for a, b, _ in edges for x in (a, b)}
    orphans = nodes - connected
    if orphans:
        warns.append(f"orphan node(s) not connected: {', '.join(sorted(orphans))}")

    if has_sub and not has_dir:
        warns.append("subgraph without any `direction` — add `direction LR/TB` to steer layout.")

    for lbl in long_labels(code):
        warns.append(f"long label ({len(lbl)} chars): \"{lbl}\" — shorten or use <br/>.")

    return errors, warns, (n, e)


def render_check(code: str) -> str | None:
    """Return an error string if mermaid-cli fails to render; None if OK/unavailable."""
    with tempfile.TemporaryDirectory() as d:
        src = Path(d) / "in.mmd"
        out = Path(d) / "out.svg"
        src.write_text(code)
        try:
            r = subprocess.run(
                ["npx", "-y", "@mermaid-js/mermaid-cli", "-i", str(src), "-o", str(out)],
                capture_output=True, text=True, timeout=180,
                # Run from the temp dir, NOT the caller's cwd: a repo package.json that
                # pins a packageManager (e.g. bun) makes npm abort with EBADDEVENGINES,
                # which has nothing to do with the diagram. The temp dir has no such file.
                cwd=str(Path(d)),
            )
        except FileNotFoundError:
            return None  # npx missing; skip silently
        except subprocess.TimeoutExpired:
            return "render timed out"
        if r.returncode != 0:
            tail = (r.stderr or r.stdout).strip().splitlines()
            return "render failed: " + (tail[-1] if tail else "unknown error")
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--max-nodes", type=int, default=12)
    ap.add_argument("--render", action="store_true", help="also syntax-check via npx mermaid-cli")
    args = ap.parse_args()

    total_err = 0
    for f in args.files:
        text = Path(f).read_text()
        for name, code in extract_blocks(text, f):
            dtype = diagram_type(code)
            print(f"\n▶ {name}  [{dtype}]")
            if dtype in ("flowchart", "graph"):
                errs, warns, (n, e) = lint_flow(name, code, args.max_nodes)
                print(f"  nodes={n} edges={e}")
                for x in errs:
                    print(f"  ✖ ERROR: {x}")
                for x in warns:
                    print(f"  ⚠ warn:  {x}")
                if not errs and not warns:
                    print("  ✓ structure clean")
                total_err += len(errs)
            else:
                print("  (structural lint only supports flowchart/graph; syntax checked via --render)")
            if args.render:
                err = render_check(code)
                if err is None:
                    print("  ✓ renders (or renderer unavailable)")
                else:
                    print(f"  ✖ ERROR: {err}")
                    total_err += 1

    print(f"\n{'✖' if total_err else '✓'} done — {total_err} error(s)")
    sys.exit(1 if total_err else 0)


if __name__ == "__main__":
    main()
