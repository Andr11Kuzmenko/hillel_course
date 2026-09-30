import { useState } from 'react'
import PropTypes from 'prop-types'

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#eef1f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#8a93a6">no image</text></svg>',
  )

function ProductImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed || !src ? PLACEHOLDER : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

ProductImage.propTypes = { src: PropTypes.string, alt: PropTypes.string.isRequired, className: PropTypes.string }

export default ProductImage
