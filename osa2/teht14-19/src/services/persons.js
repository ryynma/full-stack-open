/**
 * Moduli, joka huolehtii liikenteestä palvelimelle.
 */

import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

/**
 * Palauttaa palvelimen datan json-muodossa.
 */
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

/**
 * Lähettää lisättävän datan palvelimelle ja palauttaa promisen.
 * @param {*} newObject 
 */
const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

/**
 * Poistaa annetun id:n mukaisen datan palvelimelta.
 * @param {*} id 
 */
const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

/**
 * Päivittää palvelimella olevaa dataa.
 * @param {*} changedObject 
 */
const update = (changedObject) => {
  const id = changedObject.id
  const request = axios.put(`${baseUrl}/${id}`, changedObject)
  return request.then(response => response.data)
}

export default {getAll, create, remove, update}