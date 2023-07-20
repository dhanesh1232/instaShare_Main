import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import UserStories from '../UserStories'
import SpinLoader from '../Loader'
import UserPosts from '../UserPosts'
import SearchResult from '../SearchResult'
import './index.css'

const apiContains = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {apiStatus: apiContains.initial, searchList: [], searchInput: ''}

  componentDidMount() {
    this.getSearchData()
  }

  getSearchData = async () => {
    const {searchInput} = this.state
    this.setState({apiStatus: apiContains.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    // console.log(data)
    if (response.ok) {
      const updatedSearchData = data.posts.map(eachPost => ({
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
      this.setState({
        searchList: updatedSearchData,
        apiStatus: apiContains.success,
      })
    } else {
      this.setState({apiStatus: apiContains.failure})
    }
  }

  renderLoadingViewPost = () => (
    <div className="loading-container">
      <SpinLoader />
    </div>
  )

  onRetrySearch = () => {
    this.getSearchData()
  }

  renderFailureView = () => (
    <div className="something-went-wrong">
      <div className="card">
        <img
          src="https://res.cloudinary.com/dhzw6k0vc/image/upload/v1689172803/Something_Went-wrong_pinohx.png"
          alt="something sent wrong"
          className="search-failure-image"
        />
        <p className="search-failure-para">
          Something went wrong. Please try again
        </p>
        <button
          type="button"
          className="search-failure-btn"
          onClick={this.onRetrySearch}
        >
          Try again
        </button>
      </div>
    </div>
  )

  renderSearchSuccessView = () => {
    const {searchList} = this.state
    return (
      <div className="search-post-view">
        {searchList.length === 0 ? (
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
          <div className="search-result-display">
            <h1>Search Results</h1>
            <div className="posts-show-container-search">
              <ul className="user-post-list">
                {searchList.map(eachPost => (
                  <SearchResult post={eachPost} key={eachPost.postId} />
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }

  onDisplaySearchResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'IN_PROGRESS':
        return this.renderLoadingViewPost()
      case 'SUCCESS':
        return this.renderSearchSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  onUpdateSearchInput = searchInput => {
    this.setState({searchInput}, this.getSearchData)
  }

  render() {
    const {searchInput} = this.state
    return (
      <main className="home">
        <Header
          onUpdateSearchInput={this.onUpdateSearchInput}
          searchInput={searchInput}
        />
        {searchInput !== '' ? (
          <div className="search-result">{this.onDisplaySearchResult()}</div>
        ) : (
          <div className="home-page-main-container">
            <UserStories />
            {/* <hr className="separator" /> */}
            <UserPosts />
          </div>
        )}
      </main>
    )
  }
}
export default Home
