import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import SceneBoundary from './SceneBoundary';
import './chapter-objects.css';

const ChapterObjectScene = lazy(() => import('./ChapterObjectScene'));
const labels = { experience: 'Experience sculpture', milestones: 'Milestones sculpture', toolkit: 'Toolkit sculpture' };

export default function ChapterObject({ kind, motion }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window));
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [turn, setTurn] = useState(0);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setReady(false); setFailed(true); }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (!entry.isIntersecting) setReady(false);
    }, { rootMargin: '100px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  return <figure className="chapter-object" ref={host} aria-label={labels[kind]}>
    <div className="chapter-object-stage" aria-hidden="true">
      {(!ready || failed) && <svg className="chapter-object-fallback" viewBox="0 0 240 160" fill="none"><ellipse cx="120" cy="80" rx="76" ry="32"/><ellipse cx="120" cy="80" rx="32" ry="72" transform="rotate(48 120 80)"/><path d="M120 43 151 80 120 117 89 80Z"/><circle cx="120" cy="80" r="7"/></svg>}
      {visible && !failed && <SceneBoundary onFailure={onFailure}><Suspense fallback={null}><ChapterObjectScene kind={kind} motion={motion} turn={turn} onReady={onReady} onFailure={onFailure}/></Suspense></SceneBoundary>}
    </div>
    <figcaption><span>3D STUDY / {kind.toUpperCase()}</span><button type="button" onClick={() => setTurn(value => value + 1)} disabled={!ready || failed} aria-label={`Rotate ${labels[kind].toLowerCase()}`}>Rotate <span aria-hidden="true">↻</span></button></figcaption>
  </figure>;
}
