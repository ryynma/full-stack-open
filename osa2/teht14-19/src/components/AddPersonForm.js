import React from 'react';

const AddPersonForm = ({app}) => {
  return (
    <div>
      <h2>Lisää uusi</h2>
      <form onSubmit={app.addPerson}>
        <div>
          Nimi: <input value={app.state.newName} onChange={app.handleChangeName} />
        </div>
        <div>
          Numero: <input value={app.state.newNumber} onChange={app.handleChangeNumber} />
        </div>
        <div>
          <button type="submit">Lisää</button>
        </div>
      </form>
    </div>
  )
}

export default AddPersonForm