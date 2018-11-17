import React from 'react';
import Person from './components/Person';
import Filter from './components/Filter';
import AddPersonForm from './components/AddPersonForm';

class App extends React.Component {
  constructor(prpos) {
    super(prpos)
    this.state = {
      persons: [
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Martti Tienari', number: '040-123456' },
        { name: 'Arto Järvinen', number: '040-123456' },
        { name: 'Lea Kutvonen', number: '040-123456' }
      ],
      newName: '',
      newNumber: '',
      filter: ''
    }
  }

  addPerson = (event) => {
    event.preventDefault()
    const newName = this.state.newName.trim()
    const newNumber = this.state.newNumber.trim()

    // Jos nimi on jo taulukossa, ei tehdä mitään.
    if (this.state.persons.map(p => p.name).includes(newName)) {
      return;
    }

    // Muuten lisätään uusi henkilö taulukkoon.
    const persons = this.state.persons.concat({ name: newName, number: newNumber })
    this.setState({
      persons,
      newName: '',
      newNumber: ''
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

  render() {
    const filter = this.state.filter.toLowerCase().trim()
    const personsToShow =
      filter ?
        this.state.persons.filter(person => person.name.toLowerCase().includes(filter) ) :
        this.state.persons

    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Filter onChange={this.handleChangeFilter} />

        <h2>Lisää uusi</h2>
        <AddPersonForm app={this} />
        
        <h2>Numerot</h2>
        <table>
          <tbody>
            {personsToShow.map(person => <Person key={person.name} person={person} />)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default App