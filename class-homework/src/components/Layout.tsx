import { Link, NavLink, Outlet } from 'react-router'
import logo from '../assets/logo.jpg'

// The parts every page shares: the logo and the menu.
// <Outlet /> is where React Router puts the page for the current address.
function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <Link to="/" className="logo-link">
            <img
              className="logo"
              src={logo}
              alt="Rick and Morty Characters"
              width="640"
              height="640"
            />
          </Link>
        </h1>
        <nav className="main-nav" aria-label="Main">
          {/* `end` so "Characters" is not marked on every page */}
          <NavLink to="/" end>
            Characters
          </NavLink>
          <NavLink to="/episodes">Episodes</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
