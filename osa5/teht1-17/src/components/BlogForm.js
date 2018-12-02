import React from 'react'

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
                <form onSubmit={this.createNewBlog}>
                <div>
                    title:
                    <input
                        type="test"
                        name="title"
                        value={this.state.title}
                        onChange={this.handleFieldChange}
                    />
                </div>
                <div>
                    author:
                    <input
                        type="test"
                        name="author"
                        value={this.state.author}
                        onChange={this.handleFieldChange}
                    />
                </div>
                <div>
                    url:
                    <input
                        type="test"
                        name="url"
                        value={this.state.url}
                        onChange={this.handleFieldChange}
                    />
                </div>
                <button type="submit">Create</button>
                </form>
            </div>
        )

    }
}

export default BlogForm