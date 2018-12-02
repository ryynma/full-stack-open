import React from 'react'

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

export default Notification