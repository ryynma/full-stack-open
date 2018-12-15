import React from 'react'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'

class BlogForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      author: '',
      title: '',
      url: ''
    }
  }

  createNewBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      author: this.state.author,
      title: this.state.title,
      url: this.state.url
    }

    const succeed = await this.props.clickFunction(newBlog)

    if (succeed) {
      this.setState({
        author: '',
        title: '',
        url: ''
      })
    }
  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    return (
      <div>
        <h3>Create new</h3>
        <form onSubmit={this.createNewBlog} className="ui form">
          <div className="three fields">
            <div className="field">
              title:
              <input
                type="test"
                name="title"
                value={this.state.title}
                onChange={this.handleFieldChange}
              />
            </div>
            <div className="field">
              author:
              <input
                type="test"
                name="author"
                value={this.state.author}
                onChange={this.handleFieldChange}
              />
            </div>
            <div className="field">
              url:
              <input
                type="test"
                name="url"
                value={this.state.url}
                onChange={this.handleFieldChange}
              />
            </div>
          </div>
          <Button className="mini ui positive button" type="submit">Create</Button>
        </form>
      </div>
    )
  }
}

BlogForm.propTypes = {
  clickFunction: PropTypes.func.isRequired
}

export default BlogForm