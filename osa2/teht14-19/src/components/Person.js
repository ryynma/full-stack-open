import React from 'react';

const Person = ({ person, app }) => {

    return (
      <tr>
        <td>{person.name}</td>
        <td>{person.number}</td>
        <td><button onClick={app.removePersonOf(person.id)}>poista</button></td>
      </tr>
    )
  }
  
  export default Person