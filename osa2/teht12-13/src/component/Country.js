import React from 'react';

const Country = ({props}) => {  
  return (
    <div>
      <h2>{props.name} {props.nativeName}</h2>
      <p>Capital: {props.capital}</p>
      <p>Population: {props.population}</p>
      <img alt='Flag' src={props.flag} width='300em'></img>
    </div>
  )
}

export default Country;