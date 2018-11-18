import React from 'react';
import Person from './components/Person';
import Filter from './components/Filter';
import Notification from './components/Notification';
import AddPersonForm from './components/AddPersonForm';
import personService from './services/persons'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      filter: '',
      message: null
    }
  }

  componentDidMount() {
    personService.getAll()
      .then(persons => this.setState({persons}))
  }

  /**
   * Kertoo, löytyykö nimi luettelosta.
   * @param {*} name 
   */
  isInList = (name) => {
    return this.state.persons.map(p => p.name.toLowerCase()).includes(name.toLowerCase())
  }

  /**
   * Lisää henkilön puhelinluetteloon.
   * Jos henkilö on jo (tilamuuttujan) luettelossa,
   * varmistaa käyttäjältä, korvataanko vanha numero uudella.
   */
  addPerson = (event) => {
    event.preventDefault()
    const newName = this.state.newName.trim()
    const newNumber = this.state.newNumber.trim()

    // Jos kyseessä on uusi henkilö, lisätään hänet palvelimelle ja tilamuuttujaan.
    if (!this.isInList(newName)) {
      this.add({ name: newName, number: newNumber})

    // Muuten kysytään käyttäjältä, päivitetäänkö olemassaolevaa henkilöä.
    } else {
      const replace = window.confirm(`'${newName}' on jo luettelossa. Korvataanko vanha numero uudella?`)

      if (replace) {
        const person = this.state.persons.filter(p =>
          p.name.toLowerCase().valueOf() === newName.toLocaleLowerCase().valueOf())[0]
        const changedPerson = { ...person, number: newNumber }
        this.update(changedPerson)
      }
    }
  }

  /**
   * Lisää henkilön puhelinluetteloon palvelimelle ja tilamuuttujaan.
   */
  add = (person) => {
    personService.create(person)
    .then(createdPerson => {
      // Lisätään henkilö myös tilamuuttujaan.
      this.setState({
        persons: this.state.persons.concat(createdPerson),
        newName: '',
        newNumber: '',
        message: `Lisättiin ${createdPerson.name}`
      })
      setTimeout(() => {
        this.setState({ message: null })
      }, 4000)
    })
  }

  /**
   * Päivittää henkilön numeron palvelimelle ja tilamuuttujaan.
   */
  update = (changedPerson) => {
    personService.update(changedPerson)
      .then(updatedPerson => {
        this.setState({
          persons: this.state.persons
            .map(p => p.id !== updatedPerson.id ? p : updatedPerson),
          newName: '',
          newNumber: '',
          message: `Päivitettiin ${updatedPerson.name}`
        })
        setTimeout(() => {
          this.setState({ message: null })
        }, 4000)
      })
      // Jos henkilö oli poistettu palvelimelta juuri ennen päivitystä,
      // lisätään hänet uudestaan uudella numerolla.
      .catch(error => {
        // Poistetaan henkilö tilamuuttujasta.
        this.setState({ persons: this.state.persons.filter(p => p.id !== changedPerson.id) })
        this.add({ name: changedPerson.name, number: changedPerson.number})
        })
  }

  handleChangeName = (event) => {
    const newName = event.target.value
    this.setState({newName})
  }

  handleChangeNumber = (event) => {
    const newNumber = event.target.value
    this.setState({newNumber})
  }

  handleChangeFilter = (event) => {
    const filter = event.target.value
    this.setState({filter})
  }

  /**
   * Palauttaa funktion, jolla voidaan poistaa tietyn id:n omaava henkilö.
   */
  removePersonOf = (id) => {
    return () => {
      const nameToRemove = this.state.persons.filter(p => p.id === id).map(p => p.name)
      const ok = window.confirm(`Poistetaanko ${nameToRemove}?`)

      if (ok) {
        personService.remove(id)
          .then(removedPerson => {
            // Jos poistettiin henkilö, poistetaan myös tilamuuttujasta.
            if (removedPerson) {
              this.setState({
                persons: this.state.persons.filter(p => p.id !== id),
                message: `Poistettiin ${nameToRemove}`
              })
              setTimeout(() => {
                this.setState({ message: null })
              }, 4000)
            }
          })
          .catch((error) => {
            alert('Henkilö oli jo poistettu puhelinluettelosta')
            this.setState({ persons: this.state.persons.filter(p => p.id !== id) })
          })
      }
    }
  }

  render() {
    const filter = this.state.filter.toLowerCase().trim()
    const personsToShow =
      filter ?
        this.state.persons.filter(person => person.name.toLowerCase().includes(filter) ) :
        this.state.persons

    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification message={this.state.message} />
        <Filter onChange={this.handleChangeFilter} />
        <AddPersonForm app={this} />

        <h2>Numerot</h2>
        <table>
          <tbody>
            {personsToShow.map(person => <Person key={person.name} person={person} app={this} />)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default App