/* TEHTÄVÄT 5.17-5.18 */

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import counterReducer from './reducer'

const Statistiikka = () => {
    const hyvat = store.getState().good
    const okt = store.getState().ok
    const huonot = store.getState().bad
    const palautteita = hyvat + okt + huonot

    if (palautteita === 0) {
        return (
            <div>
                <h2>Statistiikka</h2>
                <div>ei yhtään palautetta annettu</div>
            </div>
        )
    }

    const keskiarvo = Math.round((hyvat - huonot) / palautteita * 100) / 100
    const positiivisia = Math.round(hyvat / palautteita * 1000) / 10

    const clear = () => {
        const action = {
            type: 'ZERO'
        }
        store.dispatch(action)
    }

    return (
        <div>
            <h2>Statistiikka</h2>
            <table>
                <tbody>
                    <tr>
                        <td>hyvä</td>
                        <td>{store.getState().good}</td>
                    </tr>
                    <tr>
                        <td>neutraali</td>
                        <td>{store.getState().ok}</td>
                    </tr>
                    <tr>
                        <td>huono</td>
                        <td>{store.getState().bad}</td>
                    </tr>
                    <tr>
                        <td>keskiarvo</td>
                        <td>{keskiarvo}</td>
                    </tr>
                    <tr>
                        <td>positiivisia</td>
                        <td>{positiivisia} %</td>
                    </tr>
                </tbody>
            </table>

            <button onClick={clear}>nollaa tilasto</button>
        </div >
    )
}

class App extends React.Component {
    klik = (nappi) => () => {
        const action = {
            type: nappi
        }
        store.dispatch(action)

        Statistiikka.palautteita += 1
    }

    render() {
        return (
            <div>
                <h2>Anna palautetta</h2>
                <button onClick={this.klik('GOOD')}>hyvä</button>
                <button onClick={this.klik('OK')}>neutraali</button>
                <button onClick={this.klik('BAD')}>huono</button>
                <Statistiikka />
            </div>
        )
    }
}

const store = createStore(counterReducer)
const renderApp = () => {
    ReactDOM.render(<App />, document.getElementById('root'));
}

renderApp()
store.subscribe(renderApp)