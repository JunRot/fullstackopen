import { useState, useEffect } from 'react'
import noteService from './services/notes'
import './index.css'

const Filter = (props) => (
  <div>
    filter shown with <input onChange={props.filter}></input>
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.clickAdd}>
  <div>
    name: <input
      value = {props.valueName}
      onChange={props.typingName}
    />
  </div>
  <div>
    number: <input
      value = {props.valuePhone}
      onChange={props.typingPhone}
    />
  </div>
  <div>
    <button type="submit">add</button>
  </div>
</form>
)

const PersonAll = ({ persons, userDelete }) => (
  <div>
    {persons.map((person, index) =>
      <div key={index}>
        {person.name}
        {person.number}
        <button onClick={() => userDelete(person)}>delete</button>
      </div>)
    }
  </div>  
)

const PersonFilter = (props) => (
  <div>
    {props.personshow.map((person,index) => <div key={index}> {person.name} {person.number} </div>)}
  </div>  
)

const Notification = ({ noti }) => {
  if (!noti || !noti.message) {
    return null
  }

  return (
    <div className={noti.type}>
      {noti.message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState({
    message: null, type: ""
  });

  useEffect(() => {
    console.log('effect')
    noteService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const onAdd = (event) => {
    event.preventDefault();
    // Check if input to the existing name
    console.log(persons.filter((person) => person.name === newName).length)
    if (persons.some((person) => person.name === newName)) {
      // If yes, ask user whether want to replace the old number
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        // If yes, process with the new change
        const updateID = persons.find(person => person.name === newName).id
        const updateObject = {
          name: newName,
          number: newPhone,
        }
        noteService
          .updateNumber(updateID, updateObject)
          .then(response => {
            setPersons(persons.filter(person => person.id !== updateID).concat(response));
            setMessage({message:`Number of ${newName} was updated !!!`, type: "successMessage"});
            setNewName('');
            setNewPhone('');
          })
      } else {
        window.alert('Cancel update !!!')
        }
    }
    // If not duplicated, add the new Input
    else { 
      const noteNewInput = {
        name: newName,
        number: newPhone,
        id: String(persons.length + 1),
      };
      
      noteService
        .create ({
          name: noteNewInput.name,
          number: noteNewInput.number,
          id: noteNewInput.id,
        })
        .then(response => {
          setPersons(persons.concat(response));
          setMessage({message: `Added ${newName} !!!`, type: "successMessage"});
          setNewName('');
          setNewPhone('');
        })
    }
  }

  const onDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      noteService
        .deletePerson(person.id)
        .then(() => {
          console.log('Delete successful');
          setMessage({message:`Deleted ${person.name} !!!`, type: "successMessage"});
          setPersons(persons.filter(name => name.id !== person.id));
        })
        .catch(() => {
          setMessage({ message: `Information of ${person.name} has already been removed from server`, type: "errorMessage" });
          setPersons(persons.filter(name => name.id !== person.id));
        });
    } else {
      window.alert('Cancel delete !!!');
    }
  }

  const onTypingName = (propts) => {
    console.log(propts.target.value)
    setNewName(propts.target.value)
  };

  const onTypingPhone = (propts) => {
    console.log(propts.target.value)
    setNewPhone(propts.target.value)
  };

  const onFilter = (propts) => {
    console.log(propts.target.value)
    setFilter(propts.target.value)
  };

  const personshow = (filter.length === 0) 
      ? persons
      : persons.filter((person) => person.name.toLowerCase() === filter.toLowerCase())

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification noti={message} />
      <Filter filter={onFilter} />
      <h2>Add a new</h2>
      <PersonForm
        clickAdd={onAdd}
        valueName={newName}
        typingName={onTypingName}
        valuePhone={newPhone}
        typingPhone={onTypingPhone}
      />
      
      <h2>Filter</h2>      
      <PersonFilter personshow={personshow}
      />
      
      <h2>Display All</h2>      
      <PersonAll
        persons={persons}
        userDelete={onDelete}
      />
      
    </div>
  )
}

export default App