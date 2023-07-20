import {Component} from 'react'
import Cookies from 'js-cookie'
import SpinLoader from '../Loader'
import InstaPostView from '../InstaPostView'
import './index.css'

const apiContains = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class UserPosts extends Component {
  state = {apiStatus: apiContains.initial, posts: []}

  componentDidMount() {
    this.getUsersPostsUsingApi()
  }

  getUsersPostsUsingApi = async () => {
    this.setState({apiStatus: apiContains.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const postUrl = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(postUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedPostData = data.posts.map(eachPost => ({
        // comments
        comments: eachPost.comments.map(each => ({
          comment: each.comment,
          userId: each.user_id,
          userName: each.user_name,
        })),
        // Post Details
        caption: eachPost.post_details.caption,
        postImage: eachPost.post_details.image_url,
        // Remaining Data
        createdAt: eachPost.created_at,
        likesCount: eachPost.likes_count,
        postId: eachPost.post_id,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
        profilePic: eachPost.profile_pic,
      }))
      this.setState({posts: updatedPostData, apiStatus: apiContains.success})
    } else {
      this.setState({apiStatus: apiContains.failure})
    }
  }

  renderPostLoadingView = () => (
    <div className="post-loading">
      <SpinLoader />
    </div>
  )

  onRetry = () => {
    this.getUsersPostsUsingApi()
  }

  renderPostFailureView = () => (
    <div className="main-page-failure-view">
      <div className="failure-card">
        <img
          src="https://res.cloudinary.com/dhzw6k0vc/image/upload/v1689351100/alert-triangle_cvbioz.png"
          alt="something went-wrong"
        />
        <p className="failure-para">Something went wrong. Please try again</p>
        <button
          type="button"
          onClick={this.onRetry}
          className="failure-retry-btn"
        >
          Try again
        </button>
      </div>
    </div>
  )

  renderPostsSuccessView = () => {
    const {posts} = this.state
    return (
      <div className="display-post-view">
        {posts.length === 0 ? (
          <div className="search-empty-view">
            <div className="search-empty-card">
              <img
                src="https://res.cloudinary.com/dhzw6k0vc/image/upload/v1688570715/search_not_found_ge6q3y.png"
                alt="search result not found"
                className="search-empty-image"
              />
              <h1 className="search-empty-heading">Search Not Found</h1>
              <p className="search-empty-para">
                Try different keyword or search again
              </p>
            </div>
          </div>
        ) : (
          <div className="display-post">
            <ul className="user-post-list">
              {posts.map(eachPost => (
                <InstaPostView post={eachPost} key={eachPost.postId} />
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  getUserPost = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderPostsSuccessView()
      case 'IN_PROGRESS':
        return this.renderPostLoadingView()
      case 'FAILURE':
        return this.renderPostFailureView()
      default:
        return null
    }
  }

  render() {
    return <div className="user-post-container">{this.getUserPost()}</div>
  }
}
export default UserPosts
