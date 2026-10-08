import { Link } from 'react-router'

const FEATURES = [
  {
    title: 'Every character',
    text: 'Browse all 800+ characters, search by name, and click one to see its species and episode count.',
  },
  {
    title: 'A video for each one',
    text: 'Clicking a character finds a short YouTube video about it and plays it under the details.',
  },
  {
    title: 'Every episode',
    text: 'All the episodes season by season, each with a picture and a short summary.',
  },
]

const SOURCES = [
  {
    name: 'The Rick and Morty API',
    url: 'https://rickandmortyapi.com',
    what: 'Characters, pictures and species',
  },
  {
    name: 'TVMaze API',
    url: 'https://www.tvmaze.com/api',
    what: 'Episode pictures and summaries',
  },
  {
    name: 'YouTube Data API',
    url: 'https://developers.google.com/youtube/v3',
    what: 'Short videos about the characters',
  },
]

const TOOLS = ['React', 'TypeScript', 'React Router', 'Vite', 'Vitest']

function AboutPage() {
  return (
    <div className="page about">
      <h2 className="page-title">About</h2>

      <section className="about-card about-intro">
        <span className="portal" aria-hidden="true" />
        <p>
          <strong>Rick and Morty Characters</strong> is an encyclopedia for fans
          of the show: every character and every episode in one place, made
          easy to search on a phone, a tablet or a laptop.
        </p>
        <p>
          It is a first-year web development project, built step by step with
          an AI coding agent.
        </p>
      </section>

      <section className="about-card">
        <h3>What you can do</h3>
        <ul className="feature-list">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <h4>{feature.title}</h4>
              <p>{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-card">
        <h3>Where the data comes from</h3>
        <ul className="source-list">
          {SOURCES.map((source) => (
            <li key={source.name}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.name}
              </a>
              <span>{source.what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-card">
        <h3>Built with</h3>
        <ul className="tool-list">
          {TOOLS.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </section>

      <p className="about-note">
        A fan project, not connected to Adult Swim or the creators of the show.
      </p>

      <Link to="/" className="load-more about-cta">
        Meet the characters
      </Link>
    </div>
  )
}

export default AboutPage
