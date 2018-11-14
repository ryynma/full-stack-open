/**
 * Full Stack open tehtävät 1.12-1.14
 * Anekdoottikone
*/

import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      votes: [0,0,0,0,0,0],     // taulukko anekdoottien saamille äänille
      best: 0                   // eniten ääniä saaneen anekdootin indeksi
    }
  }

  /* Arpoo seuraavan anekdootin ja näyttää sen. */
  naytaSeuraava = () => {
    const seuraava = Math.floor(Math.random() * this.props.anecdotes.length);
    this.setState({ selected: seuraava });
  }

  /* Lisää valitun anekdootin äänimäärää yhdellä. */
  vote = (anecdoteIndex) => () => {
    // Kopoidaan äänitaulu ja päivitetään anekdootin äänimäärä.
    const kopio = [...this.state.votes];
    kopio[anecdoteIndex] += 1;
    this.setState({ votes: kopio});

    // Jos äänimäärä ylittää parhaan äänimäärän, päivitetään paras anekdootti.
    if (kopio[anecdoteIndex] >= this.state.votes[this.state.best]) {
        this.setState({best: anecdoteIndex});
    }
  }

  render() {
    const selectedIndex = this.state.selected;

    return (
      <div>
        {this.props.anecdotes[selectedIndex]}<br />
        Has {this.state.votes[selectedIndex]} votes<br />

        <Button handleClick={this.vote(selectedIndex)} text="Vote" />
        <Button handleClick={this.naytaSeuraava} text="Next"/>

        <h3>Anecdote with most votes:</h3>
        {this.props.anecdotes[this.state.best]}<br />
        Has {this.state.votes[this.state.best]} votes<br />
      </div>
    )
  }
}

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>
        {text}
    </button>
)

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
