import { useEffect, useState } from 'react';
import Persons from './services/Persons.js';
import './index.css';

function Notification({ message }) {
    if (message === null) {
        return null;
    }
    return <div className='message notification'>{message}</div>;
}

function ErrorMessage({ message }) {
    if (message === null) {
        return null;
    }
    return <div className='message error'>{message}</div>;
}

function Filter({ filter, setFilter }) {
    function handleFilterChanged(event) {
        setFilter(event.target.value);
    }

    return <div>filter shown with <input value={filter} onChange={handleFilterChanged} /></div>;
}

function PersonForm({ persons, setPersons, setNotification, setError }) {
    const [newName, setNewName] = useState('');
    const [number, setNumber] = useState('');

    function handleNameChanged(event) {
        setNewName(event.target.value);
    }
    function handleNumberChanged(event) {
        setNumber(event.target.value);
    }

    function showNotification(message) {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    }
    function showError(message) {
        setError(message);
        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    function handleAddClicked(event) {
        event.preventDefault();
        const existingPerson = persons.find(person => person.name === newName);
        if (existingPerson) {
            if (confirm(`${newName} is already added to phonebook, replace the number?`)) {
                Persons
                    .updateExisting({ ...existingPerson, number: number })
                    .then(changedPerson => {
                        setPersons(persons.map(person => person.name == newName ? changedPerson : person));
                    })
                    .then(() => showNotification(`Updated ${newName}`))
                    .catch(error => {
                        showError(`${existingPerson.name} was already removed from server`);
                        setPersons(persons.filter(person => person.id !== existingPerson.id));
                    });
            }
        } else {
            Persons
                .addNew({ name: newName, number: number })
                .then(newPerson => setPersons(persons.concat(newPerson)))
                .then(() => showNotification(`Added ${newName}`));
        }
        setNewName('');
        setNumber('');
    }

    return (
        <form>
            <div>
                name: <input value={newName} onChange={handleNameChanged} />
            </div>
            <div>
                number: <input value={number} onChange={handleNumberChanged} />
            </div>
            <div>
                <button onClick={handleAddClicked}>add</button>
            </div>
        </form>
    );
}

function PersonEntry({ person, onDeleteClicked }) {
    return (
        <div>
            {person.name} {person.number} <button onClick={onDeleteClicked}>delete</button>
        </div>
    );
}

function PersonList({ persons, setPersons, filter, setNotification, setError }) {
    function showNotification(message) {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    }
    function showError(message) {
        setError(message);
        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    function onDeleteClicked(id) {
        const nameToDelete = persons.find(person => person.id === id).name;
        if (confirm(`Delete ${nameToDelete}?`)) {
            Persons
                .deleteId(id)
                .catch(error => showError(`${nameToDelete} was already removed from server`))
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id));
                    showNotification(`Deleted ${nameToDelete}`)
                })
        }
    }

    return (
        <>
            {persons
                .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
                .map(person => <PersonEntry key={person.id} person={person}
                    onDeleteClicked={() => onDeleteClicked(person.id)} />)
            }
        </>
    );
}

function App() {
    const [persons, setPersons] = useState([]);
    const [filter, setFilter] = useState('');
    const [notification, setNotification] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        Persons
            .getAll()
            .then(persons => setPersons(persons));
    }, []);

    return (
        <>
            <h2>Phonebook</h2>
            <Notification message={notification} />
            <ErrorMessage message={error} />
            <Filter filter={filter} setFilter={setFilter} />

            <h2>Add New</h2>
            <PersonForm persons={persons} setPersons={setPersons} setNotification={setNotification} setError={setError} />

            <h2>Numbers</h2>
            <PersonList persons={persons} setPersons={setPersons} filter={filter} setNotification={setNotification} setError={setError} />
        </>
    );
}

export default App;
