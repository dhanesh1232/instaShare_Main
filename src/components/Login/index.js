import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {errorDisplay: false, errorMsg: '', username: '', password: ''}

  onUpdateUsernameInState = e => {
    this.setState({username: e.target.value})
  }

  onUpdatePasswordInState = e => {
    this.setState({password: e.target.value})
  }

  updateInCookiesData = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onUpdateErrorDisplay = errorMsg => {
    this.setState({errorMsg, errorDisplay: true})
  }

  onSubmitLoginData = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      body: JSON.stringify(userDetails),
      method: 'POST',
    }
    const response = await fetch(loginUrl, options)

    const data = await response.json()
    if (response.ok) {
      this.updateInCookiesData(data.jwt_token)
    } else {
      this.onUpdateErrorDisplay(data.error_msg)
    }
    this.setState({username: '', password: ''})
  }

  render() {
    const {password, username, errorDisplay, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-main-page">
        <div className="login-card-container">
          <div className="image-container-login">
            <img
              src="https://res.cloudinary.com/dhzw6k0vc/image/upload/v1687187327/Web_Logo_Login_xeydp1.png"
              alt="website login"
              className="web-login"
            />
          </div>
          <div className="login-form-container">
            <img
              className="login-image-logo"
              alt="website logo"
              src="https://res.cloudinary.com/dhzw6k0vc/image/upload/v1687187369/Login_Page_Logo_ptoga7.png"
            />
            <h1 className="login-heading">Insta Share</h1>
            <form onSubmit={this.onSubmitLoginData} className="login-form">
              <label htmlFor="userName" className="user-name-login">
                USERNAME
              </label>
              <input
                value={username}
                type="text"
                placeholder="Enter Username"
                id="userName"
                className="login-input-text"
                onChange={this.onUpdateUsernameInState}
              />
              <label htmlFor="userPassword" className="user-name-login">
                PASSWORD
              </label>
              <input
                type="password"
                onChange={this.onUpdatePasswordInState}
                value={password}
                id="userPassword"
                placeholder="Enter Password"
                className="login-input-text"
              />
              {errorDisplay && <p className="error-msg">{errorMsg}</p>}
              <button type="submit" className="sbt-btn">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default Login
