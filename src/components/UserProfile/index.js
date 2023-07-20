import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import SpinLoader from '../Loader'
import './index.css'

const apiContains = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserProfile extends Component {
  state = {profile: [], apiStatus: apiContains.initial}

  componentDidMount() {
    this.getMyProfileData()
  }

  getMyProfileData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiContains.inProgress})
    const myProfileUrl = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(myProfileUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedProfile = [data.user_details].map(each => ({
        followersCount: each.followers_count,
        followingCount: each.following_count,
        id: each.id,
        postsCount: each.posts_count,
        profilePic: each.profile_pic,
        userBio: each.user_bio,
        userName: each.user_name,
        userId: each.user_id,
        posts: each.posts.map(eachPost => ({
          id: eachPost.id,
          postImage: eachPost.image,
        })),
        stories: each.stories.map(eachStory => ({
          id: eachStory.id,
          storyImage: eachStory.image,
        })),
      }))
      this.setState({
        profile: updatedProfile,
        apiStatus: apiContains.success,
      })
    } else {
      this.setState({apiStatus: apiContains.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loading-container">
      <SpinLoader />
    </div>
  )

  onRetryProfile = () => {
    this.getMyProfileData()
  }

  renderProfileFailureView = () => (
    <div className="failure-view-profile">
      <img
        src="https://res.cloudinary.com/dhzw6k0vc/image/upload/v1689172803/Something_Went-wrong_pinohx.png"
        alt="failure view"
        className="profile-failure-view"
      />
      <p className="failure-para-profile">
        Something went wrong. Please try again
      </p>
      <button type="button" className="retry-btn" onClick={this.onRetryProfile}>
        Try again
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {profile} = this.state
    const {
      followersCount,
      followingCount,
      userBio,
      userId,
      userName,
      profilePic,
      postsCount,
      posts,
      stories,
    } = profile[0]
    return (
      <div className="profile-page-container">
        <h1 className="head-name">{userName}</h1>
        <div className="header-section">
          <img src={profilePic} alt="user profile" className="user-profile" />
          <div className="profile-details">
            <p className="user-name-profile">{userName}</p>
            <div className="followers-data">
              <div>
                <p>{postsCount}</p> <p>posts</p>
              </div>
              <div>
                <p>{followersCount}</p> <p>followers</p>
              </div>
              <div>
                <p>{followingCount}</p> <p>followings</p>
              </div>
            </div>
            <p className="user-id">{userId}</p>
            <p className="user-bio">{userBio}</p>
          </div>
        </div>
        <div className="bio">
          <p className="user-id-b">{userId}</p>
          <p className="user-bio-b">{userBio}</p>
        </div>
        <ul className="posts-list">
          {stories.map(each => (
            <li key={each.id}>
              <img src={each.storyImage} alt="user story" />
            </li>
          ))}
        </ul>
        <hr />
        <div className="posts-view">
          <div className="post-icon">
            <BsGrid3X3 />
            <h1>Posts</h1>
          </div>
          {posts.length === 0 ? (
            <div className="no-post">
              <div>
                <BiCamera />
              </div>
              <h1>No Posts</h1>
            </div>
          ) : (
            <ul className="post-list-view">
              {posts.map(each => (
                <li key={each.id}>
                  <img src={each.postImage} alt="user post" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  renderProfileView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'IN_PROGRESS':
        return this.renderLoadingView()
      case 'FAILURE':
        return this.renderProfileFailureView()
      case 'SUCCESS':
        return this.renderProfileSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="profile-main-container">
          <div className="view-profile">{this.renderProfileView()}</div>
        </div>
      </>
    )
  }
}
export default UserProfile
