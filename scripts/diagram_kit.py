"""
Shared drawing toolkit for PolarisGCS docs diagrams.

Design goals (fixing the previous generation's issues):
  - generous, consistent spacing between boxes so arrows are never cramped
  - arrow labels sit clear ABOVE/beside the connector line, never on top of
    a box or overlapping another label
  - fan-in / converging connections use a smooth elbow (matplotlib
    "angle" connectionstyle) instead of a raw diagonal into a corner
  - every canvas reserves enough margin that nothing clips at the edges
"""
import os

import matplotlib

matplotlib.use("Agg")
import matplotlib.font_manager as fm
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

FONT_DIR = "/usr/share/fonts/opentype/inter"
for _fname in ("Inter-Regular.otf", "Inter-Medium.otf", "Inter-SemiBold.otf", "Inter-Bold.otf"):
    _path = os.path.join(FONT_DIR, _fname)
    if os.path.exists(_path):
        fm.fontManager.addfont(_path)

FONT = "Inter"

INK = "#0f172a"
INK_DIM = "#5b6472"
LINE_SOFT = "#d6dde6"
BORDER = "#66707e"
BOX_FILL = "#eef1f6"
BOX_FILL_ACCENT = "#eaf3ff"
ACCENT = "#2f7bdb"
ARROW = "#7a8494"

# public/ is what Vite actually serves at /context-images/... — the sibling
# top-level context-images/ directory is a stale, unserved duplicate.
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "context-images")


def out_path(name):
    return os.path.join(OUT_DIR, name)


def new_canvas(w, h):
    fig, ax = plt.subplots(figsize=(w, h), dpi=200)
    ax.set_xlim(0, w)
    ax.set_ylim(0, h)
    ax.set_aspect("equal")
    ax.axis("off")
    fig.patch.set_facecolor("white")
    return fig, ax


def header(ax, w, title, subtitle, y_top):
    ax.text(0.55, y_top, title, fontsize=27, fontweight="bold", color=INK, family=FONT, va="top")
    ax.text(0.55, y_top - 0.6, subtitle, fontsize=15, color=INK_DIM, family=FONT, va="top")
    line_y = y_top - 1.0
    ax.plot([0.55, w - 0.55], [line_y, line_y], color=LINE_SOFT, lw=1.5, solid_capstyle="round", zorder=1)


def box(ax, cx, cy, w, h, title, sub=None, accent=False, dashed=False, title_size=17, sub_size=12.5, sub_gap=0.34):
    fc = BOX_FILL_ACCENT if accent else BOX_FILL
    ec = ACCENT if accent else BORDER
    lw = 2.8 if accent else 1.9
    ls = (0, (7, 5)) if dashed else "solid"
    patch = FancyBboxPatch(
        (cx - w / 2, cy - h / 2), w, h,
        boxstyle="round,pad=0,rounding_size=0.17",
        linewidth=lw, edgecolor=ec, facecolor=fc, linestyle=ls,
        joinstyle="round", zorder=3,
    )
    ax.add_patch(patch)
    if sub:
        ax.text(cx, cy + sub_gap, title, fontsize=title_size, fontweight="bold", color=INK,
                 family=FONT, ha="center", va="center", zorder=4)
        ax.text(cx, cy - sub_gap * 1.05, sub, fontsize=sub_size, color=INK_DIM, family=FONT,
                 ha="center", va="center", zorder=4, linespacing=1.6)
    else:
        ax.text(cx, cy, title, fontsize=title_size, fontweight="bold", color=INK,
                 family=FONT, ha="center", va="center", zorder=4)
    return patch


def label_pill(ax, x, y, text, fontsize=12.5, color=INK):
    ax.text(x, y, text, fontsize=fontsize, fontweight="bold", color=color, family=FONT,
             ha="center", va="center", zorder=6,
             bbox=dict(boxstyle="round,pad=0.36", fc="white", ec=LINE_SOFT, lw=1.2))


def h_arrow(ax, x1, y1, x2, y2=None, color=ARROW, lw=2.4, label=None, label_dy=0.5):
    y2 = y1 if y2 is None else y2
    arr = FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>", mutation_scale=20,
                           linewidth=lw, color=color, shrinkA=0, shrinkB=0, zorder=2)
    ax.add_patch(arr)
    if label:
        label_pill(ax, (x1 + x2) / 2, (y1 + y2) / 2 + label_dy, label)


def v_arrow(ax, x, y1, y2, color=ARROW, lw=2.4, label=None, label_dx=0.0, label_dy=0.0):
    arr = FancyArrowPatch((x, y1), (x, y2), arrowstyle="-|>", mutation_scale=20,
                           linewidth=lw, color=color, shrinkA=0, shrinkB=0, zorder=2)
    ax.add_patch(arr)
    if label:
        label_pill(ax, x + label_dx, (y1 + y2) / 2 + label_dy, label)


def elbow_arrow(ax, p1, p2, color=ARROW, lw=2.3, rad=0.22, label=None, label_pos=None):
    """Smooth curved connector for fan-in/out layouts — bows around instead
    of cutting a raw diagonal into a box corner. `arc3` (unlike `angle`)
    only needs the two endpoints, so it can't fail on collinear/parallel
    rays the way an angle-based connector can."""
    arr = FancyArrowPatch(
        p1, p2, arrowstyle="-|>", mutation_scale=18,
        connectionstyle=f"arc3,rad={rad}",
        linewidth=lw, color=color, shrinkA=2, shrinkB=6, zorder=2,
    )
    ax.add_patch(arr)
    if label and label_pos:
        label_pill(ax, label_pos[0], label_pos[1], label, fontsize=12)


def save(fig, name):
    path = out_path(name)
    fig.savefig(path, dpi=200, facecolor="white", bbox_inches="tight", pad_inches=0.35)
    plt.close(fig)
    print(f"wrote {path}")
