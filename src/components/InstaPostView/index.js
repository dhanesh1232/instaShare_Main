import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {BsHeart, BsHeartFill} from 'react-icons/bs'
import './index.css'

class InstaPostView extends Component {
  state = {isLiked: false}

  onToggleLike = async () => {
    this.setState(prev => ({isLiked: !prev.isLiked}))
    const {post} = this.props
    const {postId} = post
    const {isLiked} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const likedRequestBody = {
      like_status: isLiked,
    }

    const likedPostUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(likedRequestBody),
    }

    const response = await fetch(likedPostUrl, options)
    const fetchedData = await response.json()

    console.log(fetchedData)
  }

  render() {
    const {post} = this.props

    const {
      comments,
      caption,
      createdAt,
      likesCount,
      userId,
      userName,
      postImage,
      profilePic,
    } = post
    const {isLiked} = this.state
    return (
      <li className="post-view-display-user">
        <Link to={`/users/${userId}`} className="nav-link-user">
          <div className="profile-bg">
            <img
              src={profilePic}
              alt="post author profile"
              className="profile-pic"
            />
          </div>
          <p className="user-name">{userName}</p>
        </Link>
        <img src={postImage} alt="post" className="post-image" />
        <div className="likes-and-comments-view">
          <div className="like-line-button">
            {!isLiked && (
              <button
                type="button"
                onClick={this.onToggleLike}
                className="like-btn"
              >
                <BsHeart />
              </button>
            )}
            {isLiked && (
              <button
                type="button"
                onClick={this.onToggleLike}
                className="like-btn"
              >
                <BsHeartFill color="red" />
              </button>
            )}
            <button type="button" className="like-btn">
              <FaRegComment />
            </button>
            <button type="button" className="like-btn">
              <BiShareAlt />
            </button>
          </div>
          <div className="bottom-content">
            <p className="likes">{likesCount} likes</p>
            <p className="caption">{caption}</p>
            <ul className="list-comments">
              {comments.map(each => (
                <li className="cm-li" key={each.userId}>
                  <p className="name">{each.userName}</p>
                  <p>{each.comment}</p>
                </li>
              ))}
            </ul>
            <p className="posted-at">{createdAt}</p>
          </div>
        </div>
      </li>
    )
  }
}
export default InstaPostView
