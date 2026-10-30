export default function Icon({ name, size = 20, ...props }) {
  const paths = {
    external: <><path d="M7 17 17 7M7 7h10v10" /></>,
    play: <path d="m9 5 11 7-11 7Z" />,
    palette: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none" /></>,
    award: <><circle cx="12" cy="9" r="5" /><path d="m8 13-1 8 5-3 5 3-1-8M10 9l1.3 1.3L14 7.5" /></>,
    paper: <><path d="M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.external}</svg>;
}
