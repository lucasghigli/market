import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="not-found-code">404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn btn--primary btn--lg">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
