import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

class Togglable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    // Näytetäänkö lapset vai pelkkä nappi
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    return (
      <div className="togglable">
        <div style={hideWhenVisible}>
          <button onClick={this.toggleVisibility}>
            {this.props.buttonLabel}
          </button>
        </div>

        <div style={showWhenVisible}>
          {this.props.children}
          <Button className="mini ui negative button" onClick={this.toggleVisibility}>Cancel</Button>
        </div>
      </div>
    )
  }
}

Togglable.propTypes = {
  commentOnBlog: PropTypes.func,
  children: PropTypes.object.isRequired,
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable