import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import ProtectedRoute from '../ProtectRoute'
import Login from '../Login'
import InstaShareContext from '../../Context/instaShareContext'
import MyProfile from '../MyProfile'
import UserProfile from '../UserProfile'
import Home from '../Home'
import NotFound from '../NotFound'
import './index.css'

class InstaShare extends Component {
  state = {
    searchPanel: false,
    onDisplayMenu: false,
  }

  // Show and Close Menu Items
  onClickMenuButton = () => {
    this.setState(prevState => ({
      onDisplayMenu: !prevState.onDisplayMenu,
      searchPanel: false,
    }))
  }

  onCloseMenuNavItems = () => {
    this.setState({onDisplayMenu: false})
  }

  onDisplaySearchPanel = () => {
    this.setState({searchPanel: true, onDisplayMenu: false})
  }

  render() {
    const {searchPanel, onDisplayMenu} = this.state
    return (
      <InstaShareContext.Provider
        value={{
          onDisplaySearchPanel: this.onDisplaySearchPanel,
          searchPanel,
          onClickMenuButton: this.onClickMenuButton,
          onCloseMenuNavItems: this.onCloseMenuNavItems,
          onDisplayMenu,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <Route path="/bad-path" component={NotFound} />
          <Redirect to="/bad-path" />
        </Switch>
      </InstaShareContext.Provider>
    )
  }
}
export default InstaShare
