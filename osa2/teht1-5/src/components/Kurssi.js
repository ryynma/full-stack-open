/**
 * Moduli Kurssi-komponentille alikomponentteineen.
 */

import React from 'react'

const Kurssi = ({ kurssi }) => (
    <div>
        <Otsikko kurssi={kurssi}/>
        <Sisalto kurssi={kurssi} />
        <Yhteensa kurssi={kurssi} />
    </div>
)

const Otsikko = (props) => <h1>{props.kurssi.nimi}</h1>

const Sisalto = (props) => {
  const osat = props.kurssi.osat
  return(
    <div>
        {osat.map(osa => <Osa key={osa.nimi} osa={osa.nimi} tehtavia={osa.tehtavia} />)}
    </div>
  )
}

const Osa = (props) => <p>{props.osa} {props.tehtavia}</p>

const Yhteensa = (props) => {
  const lkm = props.kurssi.osat.reduce((summa, osa) => summa += osa.tehtavia, 0)
  return(
    <p>yhteensä {lkm} tehtävää</p>
  )
}

export default Kurssi