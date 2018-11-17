import React from 'react';
import Country from './component/Country'
import axios from 'axios';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      filter: '',
      countries: []
    }
  }

  /* Haetaan data palvelimelta. */
  componentDidMount() {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        this.setState({ countries: response.data })
      })
  }

  /**
   * Päivittää tilamuuttujaa filter.
   */
  handleChangeFilter = (event) => this.setState({ filter: event.target.value })

  /**
   * Asettaa tilamuuttujaan filter tapahtuman kohteen data-value-arvon.
   */
  setFilter = (event) => this.setState({ filter: event.target.getAttribute('data-value') })

  /* Määrittää mitä näytetään, riippuen suodatuksen tuloksesta. */
  countriesToShow = () => {
    const filter = this.state.filter.trim().toLowerCase()

    const filteredCountries = this.state.countries
      .filter(country => {
        return country.name.toLowerCase().includes(filter)
        || country.nativeName.toLowerCase().includes(filter)
      })

    if (filteredCountries.length === 0) {
      return (<div>There are no matches, specify another filter</div>)

    // Jos maita on vain yksi, näytetään se.
    } else if (filteredCountries.length === 1) {
      return (<Country props={filteredCountries[0]} />)

    // Jos maita on enintään 10, näytetään vain maiden nimet.
    } else if (filteredCountries.length <= 10) {
      return (filteredCountries.map(country =>
        <div key={country.name} data-value={country.name} onClick={this.setFilter}>
          {country.name}
        </div>
      ))

    } else {
      return (<div>Too many matches, specify another filter</div>)
    }
  }

  render() {
    return (
      <div>
          Find countries: 
          <input
            value={this.state.filter}
            onChange={this.handleChangeFilter}
          />
        {this.countriesToShow()}
      </div>
    );
  }
}

export default App;
