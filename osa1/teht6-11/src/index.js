/**
 * Full Stack open tehtävät 1.6-1.11
 * Unicafen asiakaspalautteen keruu.
*/

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hyva: 0,
            neutraali: 0,
            huono: 0
        }
    }

    asetaArvo = (palaute, arvo) => () => this.setState({ [palaute]: arvo});

    render() {
        return (
            <div>
                <div>
                    <h3>Anna palautetta</h3>
                    <Button
                        handleClick={this.asetaArvo("hyva", this.state.hyva + 1)}
                        text="hyvä"
                    />
                    <Button
                        handleClick={this.asetaArvo("neutraali", this.state.neutraali + 1)}
                        text="neutraali"
                    />
                     <Button
                        handleClick={this.asetaArvo("huono", this.state.huono + 1)}
                        text="huono"
                    />
                </div>
                <div>
                    <h3>Statistiikka</h3>
                    <Statistics
                        hyvat={this.state.hyva}
                        neutraalit={this.state.neutraali}
                        huonot={this.state.huono}
                    />
                </div>
            </div>
        )
    }
}

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>
        {text}
    </button>
)

const Statistics = ({ hyvat, neutraalit, huonot }) => {
    const lkm = Math.max(hyvat + neutraalit + huonot);
    if (lkm === 0) {
        return (<div>Ei yhtään palautetta annettu</div>)
    }

    const summa = hyvat - huonot;
    const keskiarvo = (summa / lkm).toFixed(1);
    const positiiviset = (hyvat / lkm * 100).toFixed(1) + ' %';

    return (
        <div>
            <table>
                <tbody>
                    <Statistic text="Hyvä" value={hyvat} />    
                    <Statistic text="Neutraali" value={neutraalit} />
                    <Statistic text="Huono" value={huonot} />
                    <Statistic text="Keskiarvo" value={keskiarvo} />
                    <Statistic text="Positiivisia" value={positiiviset} />
                </tbody>
            </table>
        </div>
    )
}

const Statistic = ({text, value}) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
)


ReactDOM.render(<App />, document.getElementById('root'));