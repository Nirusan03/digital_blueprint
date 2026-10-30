// Original line illustrations: no icon font, image request or runtime dependency.
const marks = {
  laurels: [
    ['circle',{cx:24,cy:19,r:9}], ['path',{d:'m20 19 3 3 6-6M18 27l-2 15 8-5 8 5-2-15'}],
    ['path',{d:'M10 31C3 24 4 13 11 7M8 15l-4-1M8 22l-5 1M38 31c7-7 6-18-1-24M40 15l4-1M40 22l5 1'}],
  ],
  quantum: [
    ['ellipse',{cx:24,cy:24,rx:21,ry:8}], ['ellipse',{cx:24,cy:24,rx:21,ry:8,transform:'rotate(60 24 24)'}],
    ['ellipse',{cx:24,cy:24,rx:21,ry:8,transform:'rotate(120 24 24)'}], ['circle',{cx:24,cy:24,r:3,fill:'currentColor'}],
    ['circle',{cx:43,cy:21,r:2.5,fill:'currentColor'}],
  ],
  graduate: [
    ['path',{d:'m3 17 21-10 21 10-21 10Z'}], ['path',{d:'M11 22v12c8 7 18 7 26 0V22M44 18v16M41 40l3-6 3 6'}],
    ['path',{d:'m20 32 3 3 6-6'}],
  ],
  research: [
    ['path',{d:'M18 5h12M20 5v15L7 39c-1 2 0 4 3 4h28c3 0 4-2 3-4L28 20V5'}],
    ['path',{d:'M13 31c6-5 13 5 22 0M19 36h.1M29 39h.1'}], ['circle',{cx:24,cy:26,r:2}],
    ['path',{d:'M39 7v8M35 11h8'}],
  ],
  globe: [
    ['circle',{cx:24,cy:24,r:17}], ['ellipse',{cx:24,cy:24,rx:8,ry:17}],
    ['path',{d:'M8 18h32M8 30h32'}], ['path',{d:'M7 8 3 15M41 40l4-7'}],
    ['circle',{cx:39,cy:9,r:3,fill:'currentColor'}],
  ],
  immersive: [
    ['path',{d:'M8 15h32l4 17-6 5H28l-4-5-4 5H10l-6-5ZM8 15l7-7h18l7 7'}],
    ['circle',{cx:15,cy:25,r:4}], ['circle',{cx:33,cy:25,r:4}], ['path',{d:'M19 43h10M24 39v4'}],
  ],
  trophy: [
    ['path',{d:'M14 7h20v12c0 9-5 13-10 13s-10-4-10-13Z'}],
    ['path',{d:'M14 11H5v7c0 6 4 8 11 8M34 11h9v7c0 6-4 8-11 8M24 32v9M15 43h18'}],
    ['path',{d:'m24 12 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z'}],
  ],
  code: [
    ['path',{d:'m15 13-11 11 11 11M33 13l11 11-11 11M28 7l-8 34'}],
    ['path',{d:'M3 6h7M38 42h7'}],
  ],
  launch: [
    ['path',{d:'M20 29c-2-11 11-22 23-24-1 12-12 25-23 24ZM20 29l-5 5M22 17l-11 1-6 10 13-2M31 28l-1 10-10 6 3-13'}],
    ['circle',{cx:33,cy:15,r:4}], ['path',{d:'M11 34c-5 1-6 6-6 9 3 0 8-1 9-6'}],
  ],
  podium: [
    ['path',{d:'M5 27h12v16H5ZM17 19h14v24H17ZM31 31h12v12H31M3 43h42'}],
    ['path',{d:'m24 3 2 5 6 1-4 4 1 5-5-3-5 3 1-5-4-4 6-1Z'}],
  ],
  growth: [
    ['path',{d:'M6 5v38h38M12 33l10-12 9 5L43 9M32 9h11v11'}],
    ['path',{d:'M14 39v-4M24 39V28M34 39V29'}],
  ],
};
export default function MilestoneIcon({ name }) {
  return (
    <span className="milestone-symbol" aria-hidden="true">
      <span className="milestone-orbit" />
      <svg className="milestone-icon" viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        {(marks[name] || marks.laurels).map(([Shape,props],index) => <Shape key={index} {...props} pathLength="1" className="milestone-stroke" style={{'--stroke-index':index}} />)}
      </svg>
    </span>
  );
}
