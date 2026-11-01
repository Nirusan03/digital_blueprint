import Workspace from "./workspace/Workspace";
import SceneBoundary from "./workspace/SceneBoundary";
import { CONTACT } from "./constants";

const failed = (
  <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", gap: 12, padding: 24, background: "#0b0b0c", color: "#f3f0ea", fontFamily: "system-ui, sans-serif" }}>
    <h1 style={{ margin: 0, fontSize: 28 }}>Nirusan Hariharan</h1>
    <p style={{ margin: 0 }}>Something went wrong loading this page. Please refresh, or write to <a style={{ color: "inherit" }} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
  </main>
);

export default function App() {
  return <SceneBoundary fallback={failed}><Workspace /></SceneBoundary>;
}
