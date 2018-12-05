import React from 'react'
import { filterSetting } from '../reducers/filterReducer'
import { connect } from 'react-redux'

class Filter extends React.Component {
  handleChange = (event) => {
    // input-kentän arvo muuttujassa event.target.value
    this.props.filterSetting(event.target.value)
  }
  render() {
    const style = {
      marginBottom: 10
    }

    return (
      <div style={style}>
        filter <input onChange={this.handleChange} />
      </div>
    )
  }
}

const ConnectedFilter = connect(
  null,
  { filterSetting }
)(Filter)

export default ConnectedFilter