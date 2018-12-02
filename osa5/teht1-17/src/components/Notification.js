import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  const className = isError ? "error" : "message"

  return (
    <div className={className}>
      {message}
    </div>
  )
}

Notification.PropTypes = {
  message: PropTypes.string.isRequired,
  isError: PropTypes.bool
}

export default Notification