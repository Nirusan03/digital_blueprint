// The empty space in the hero, measured from the real layout: below the intro text, or beside it,
// whichever holds the bench larger. The 3D and the still frame both fit themselves into this.
const BENCH_ASPECT = 1.3;
const NAV = 66;

export default function heroBox(view) {
  const width = view.clientWidth;
  const height = view.clientHeight;
  const gutter = Math.max(12, width * 0.02);
  const gap = Math.max(4, height * 0.015);
  const floor = view.querySelector(".film-name").offsetTop - gap;
  const lede = view.querySelector(".film-lede");
  const shown = lede && lede.offsetParent;
  const ledeBottom = shown ? lede.offsetTop + lede.offsetHeight : NAV;
  const ledeRight = shown ? lede.offsetLeft + lede.offsetWidth : gutter;
  const below = { left: gutter, top: ledeBottom + gap, width: width - gutter * 2, height: floor - ledeBottom - gap };
  const beside = { left: ledeRight + gap, top: NAV, width: width - ledeRight - gap - gutter, height: floor - NAV };
  // The portrait block shares the intro's column, so the bench must stay beside it.
  const card = view.querySelector(".film-card");
  const size = (box) => Math.min(box.width / BENCH_ASPECT, box.height);
  const box = card?.offsetParent || size(beside) > size(below) ? beside : below;
  return { left: box.left, top: box.top, width: Math.max(1, box.width), height: Math.max(1, box.height) };
}
