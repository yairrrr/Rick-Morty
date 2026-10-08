import { Link } from 'react-router'

// Shown for any address that has no page
function NotFoundPage() {
  return (
    <div className="page not-found">
      <span className="portal" aria-hidden="true" />
      <h2 className="page-title">Wrong dimension!</h2>
      <p>There is no page at this address.</p>
      <Link to="/" className="load-more">
        Back to the characters
      </Link>
    </div>
  )
}

export default NotFoundPage
