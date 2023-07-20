import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-main-page">
    <div className="not-found-card">
      <img
        src="https://res.cloudinary.com/dhzw6k0vc/image/upload/v1688055085/erroring_2_erielk.svg"
        alt="page not found"
        className="not-found-image"
      />
      <h1>PAGE NOT FOUND</h1>
      <p className="not-found-para">
        we are sorry, the page you requested could not be found <br />
        Please go back to the homepage
      </p>
      <Link to="/" className="nav-btn">
        <button type="button">Home Page</button>
      </Link>
    </div>
  </div>
)
export default NotFound
