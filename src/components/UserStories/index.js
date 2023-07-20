import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import SpinLoader from '../Loader'

import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 9,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 9,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
  ],
}

const apiContains = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class UserStories extends Component {
  state = {userStories: [], apiStatus: apiContains.initial}

  componentDidMount() {
    this.getUserStories()
  }

  getUserStories = async () => {
    this.setState({apiStatus: apiContains.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.users_stories.map(eachStory => ({
        userId: eachStory.user_id,
        userName: eachStory.user_name,
        storyUrl: eachStory.story_url,
      }))
      this.setState({userStories: updatedData, apiStatus: apiContains.success})
    } else {
      this.setState({apiStatus: apiContains.failure})
    }
  }

  onRetry = () => {
    this.getUserStories()
  }

  renderStoriesView = () => (
    <div className="story-loader">
      <SpinLoader />
    </div>
  )

  renderStoriesSuccessView = () => {
    const {userStories} = this.state
    return (
      <ul className="slick-container">
        <Slider {...settings}>
          {userStories.map(eachLogo => {
            const {storyUrl, userName} = eachLogo
            return (
              <li className="slick-item" key={userName}>
                <img className="logo-image" src={storyUrl} alt="user story" />
                <p className="story-name">
                  {userName.length > 8
                    ? `${userName.slice(0, 7)}....`
                    : `${userName}`}
                </p>
              </li>
            )
          })}
        </Slider>
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="story-failure-view">
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderUserStoryView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'IN_PROGRESS':
        return this.renderStoriesView()
      case 'SUCCESS':
        return this.renderStoriesSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <div className="main-container">{this.renderUserStoryView()}</div>
  }
}
export default UserStories
