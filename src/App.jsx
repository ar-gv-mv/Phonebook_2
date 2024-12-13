import { useState, useEffect } from 'react'
import axios from 'axios';
import service from './service'


const Filter = ({value, onChange}) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange}/> 
    </div>
  )
}

const PersonForm = ({onSubmit, valueName, valueNumber, onChangeName, onChangeNumber}) => {
  return (
    <form onSubmit={onSubmit}>
        <div>
          name: <input value={valueName} onChange={onChangeName}/>
        </div>
        <div>
          number: <input value={valueNumber} onChange={onChangeNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Persons = ({onSubmit, filtering}) => {
  return (
    <div>
      {filtering.map((per) => 
      <p key={per.id}>{per.name} {per.number}
        <button onClick={() => onSubmit(per.id, per.name)}>
          delete
        </button>
      </p>)}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {

    service
      .getAll()
      .then(response => {
      setPersons(response)
    })
  }, [])

  const noteChangeName = (event) => {
    setNewName(event.target.value)
  }

  const noteChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const searchSmth = (event) => {
    setNewSearch(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    const inPersons = persons.find(person => JSON.stringify(person.name) === JSON.stringify(newName) && JSON.stringify(person.number) === JSON.stringify(newNumber))
    console.log(inPersons ? true : false)
    const notInNumbers = persons.find(person => JSON.stringify(person.name) === JSON.stringify(newName) && JSON.stringify(person.number) !== JSON.stringify(newNumber))

    if (inPersons) {
      alert(`${newName} is already added to phonebook`)

    } else if (notInNumbers) {
      const toConfirm = window.confirm(`${newName} is already addedto phonebook, replace the old number with a new one?`)
      if (toConfirm) {
        const pers = persons.find(n => n.name === newName)
        const changedNum = { ...pers, number: newNumber }
        service
        .update(pers.id, changedNum)
        .then(response => {
          setPersons(persons.map(person => person.id === pers.id ? response : person))
          setNewName('')
          setNewNumber('')})
      }
    } else {
      const noteObject = {
        name: newName,
        number: newNumber
        }

    service
      .create(noteObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
      })
    }
  }
  
  const deleteNote = (id, name) => {
    const toDeleting = window.confirm(`Delete ${name}?`)
    if (toDeleting) {
      service
        .deleting(id)
        .then(() => {
          const updPer = persons.filter(per => per.id !== id)
          setPersons(updPer)
        })
    }
  }
  const filtering = persons.filter(person => person.name.toLowerCase().startsWith(newSearch.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter  value={newSearch} onChange={searchSmth}/>
      <h3>add a new</h3>
      <PersonForm onSubmit={addNote} valueName={newName} valueNumber={newNumber} onChangeName={noteChangeName} onChangeNumber={noteChangeNumber}/>
      <h2>Numbers</h2>
      <Persons onSubmit={deleteNote} filtering={filtering}/>
    </div>
  )
}

export default App
