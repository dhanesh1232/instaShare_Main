import {Link, withRouter} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import {GiHamburgerMenu} from 'react-icons/gi'
import Cookies from 'js-cookie'
import {AiFillCloseCircle} from 'react-icons/ai'
import InstaShareContext from '../../Context/instaShareContext'

import './index.css'

const Header = props => {
  const {onUpdateSearchInput, searchInput} = props
  const logoutUser = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <InstaShareContext.Consumer>
      {value => {
        const {
          searchPanel,
          onDisplayMenu,
          onClickMenuButton,
          onCloseMenuNavItems,
          onDisplaySearchPanel,
        } = value
        const onShowMenuItems = () => {
          onClickMenuButton()
        }
        const onCloseMenu = () => {
          onCloseMenuNavItems()
        }
        const onShowSearchPanel = () => {
          onDisplaySearchPanel()
        }
        const onChangeSearchValue = e => {
          onUpdateSearchInput(e.target.value)
        }
        return (
          <header className="header-container">
            <ul className="nav-bar">
              <Link to="/" className="image-container">
                <img
                  src="https://res.cloudinary.com/dhzw6k0vc/image/upload/v1687187369/Login_Page_Logo_ptoga7.png"
                  alt="website logo"
                  className="website-image"
                />
                <h1 className="web-heading">Insta Share</h1>
              </Link>

              <li className="desktop-view">
                <div className="search-container">
                  <input
                    type="search"
                    placeholder="Search Caption"
                    className="search-input"
                    value={searchInput}
                    onChange={onChangeSearchValue}
                  />
                  <button type="button" className="search-btn">
                    <FaSearch />
                  </button>
                </div>
                <ul className="nav-list-items">
                  <Link to="/" className="nav-link-item link">
                    <li>Home</li>
                  </Link>
                  <Link to="/my-profile" className="nav-link-item link">
                    <li>Profile</li>
                  </Link>
                </ul>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={logoutUser}
                >
                  Logout
                </button>
              </li>
              <button
                type="button"
                className="mobile-menu-btn"
                onClick={onShowMenuItems}
              >
                <GiHamburgerMenu />
              </button>
            </ul>
            {onDisplayMenu && (
              <div className="showing-nav-items">
                <ul className="nav-list-items-mobile">
                  <Link to="/" className="nav-link-item link">
                    <li>Home</li>
                  </Link>
                  <button
                    className="search-btn link"
                    type="button"
                    onClick={onShowSearchPanel}
                  >
                    Search
                  </button>
                  <Link to="/my-profile" className="nav-link-item link">
                    <li>Profile</li>
                  </Link>
                  <button
                    type="button"
                    className="logout-btn"
                    onClick={logoutUser}
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    className="close-menu-btn"
                    onClick={onCloseMenu}
                  >
                    <AiFillCloseCircle />
                  </button>
                </ul>
              </div>
            )}
            {searchPanel && (
              <div className="search-panel-mobile">
                <div className="search-container">
                  <input
                    className="search-input"
                    type="search"
                    placeholder="Search Caption"
                    value={searchInput}
                    onChange={onChangeSearchValue}
                  />
                  <button
                    type="button"
                    className="search-btn"
                    data-testid="searchIcon"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
            )}
          </header>
        )
      }}
    </InstaShareContext.Consumer>
  )
}
export default withRouter(Header)
