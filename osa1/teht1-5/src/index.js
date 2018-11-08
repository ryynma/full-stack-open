/**
 * Full Stack open tehtävät 1.1-1.5
*/

import React from 'react';
import ReactDOM from 'react-dom';

const Otsikko = (props) => (
    <h1>{props.kurssi}</h1>
)

const Sisalto = (props) => (
    <div>
        <Osa osa={props.osat[0].nimi} tehtavia={props.osat[0].tehtavia} />
        <Osa osa={props.osat[1].nimi} tehtavia={props.osat[1].tehtavia} />
        <Osa osa={props.osat[2].nimi} tehtavia={props.osat[2].tehtavia} />
    </div>
)

const Osa = (props) => (
    <p>{props.osa} {props.tehtavia}</p>
)

const Yhteensa = (props) => {
    const yhteensa = props.osat[0].tehtavia + props.osat[1].tehtavia + props.osat[2].tehtavia
    return (<p>yhteensä {yhteensa} tehtävää</p>)
}

const App = () => {
    const kurssi = {
        nimi: 'Half Stack -sovelluskehitys',
        osat: [
            {
                nimi: 'Reactin perusteet',
                tehtavia: 10
            },
            {
                nimi: 'Tiedonvälitys propseilla',
                tehtavia: 7
            },
            {
                nimi: 'Komponenttien tila',
                tehtavia: 14
            }
        ]
    }

    return (
        <div>
            <Otsikko kurssi={kurssi.nimi} />
            <Sisalto osat={kurssi.osat} />
            <Yhteensa osat={kurssi.osat} />
        </div>
    )
}

/* <p>yhteensä {tehtavia1 + tehtavia2 + tehtavia3} tehtävää</p> */

ReactDOM.render(<App />, document.getElementById('root'));
