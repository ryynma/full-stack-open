import React from 'react';

const AddPersonForm = ({app}) => {
  return (
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
  )
}

export default AddPersonForm