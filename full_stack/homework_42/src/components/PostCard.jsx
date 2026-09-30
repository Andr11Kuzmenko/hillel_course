import PropTypes from 'prop-types'

function PostCard({ id, title, body }) {
  return (
    <li className="post">
      <span className="post__id">#{id}</span>
      <h3 className="post__title">{title}</h3>
      <p className="post__body">{body}</p>
    </li>
  )
}

PostCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
}

export default PostCard
