import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Notification extends React.Component {
  render() {
    if (this.props.message === null) {
      return null
    }
    const className = this.props.isError ? 'error' : 'message'
    return (
      <div className={className}>
        {this.props.message}
      </div>
    )
  }
}

const ConnectedNotification = connect(
  (state) => ({
    message: state.notification.message,
    isError: state.notification.isError
  })
)(Notification)

Notification.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool
}

export default ConnectedNotification