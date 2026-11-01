import { CONTACT } from "../constants";

export default function RepositoryLinks({ project }) {
  if (project.links)
    return project.links.map(({ label, url }) => (
      <a key={url} href={url} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    ));
  if (project.website)
    return (
      <a href={project.website} target="_blank" rel="noopener noreferrer">
        Visit the project
      </a>
    );
  if (project.sourceStatus === "unavailable")
    return (
      <a
        href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(project.title + " project walkthrough")}`}
      >
        Discuss this project
      </a>
    );
  return (
    project.githubs || [{ label: "View source", url: project.github }]
  ).map((repo) => (
    <a key={repo.url} href={repo.url} target="_blank" rel="noopener noreferrer">
      {repo.label}
    </a>
  ));
}
