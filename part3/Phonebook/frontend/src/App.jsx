import {useEffect, useState} from 'react';
import personsService from './services/persons';

import Filter from "./components/Filter.jsx";
import AddContact from "./components/AddContact.jsx";
import ContactList from "./components/ContactList.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [notification, setNotification] = useState({message: '', success: true});

    useEffect(() => {
        personsService
            .getAll()
            .then(persons => {
                setPersons(persons);
            });
    }, []);

    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

    const notificationTimeout = () => {
        setTimeout(() => {
            console.log('***Notification timeout');
            setNotification({message: '', success: true});
        }, 10000);
    }

    const addPerson = (event) => {
        event.preventDefault();

        const existingPerson = persons.find(person => person.name === newName);

        if (existingPerson) {
            if (window.confirm(`${newName} is already in the phonebook. Do you want to replace the old number with a new one?`)) {
                personsService
                    .replace(existingPerson.id, {name: existingPerson.name, number: newNumber})
                    .then(replacedPerson => {
                        setPersons(persons.map(person => person.id === replacedPerson.id ? replacedPerson : person));
                        setNewName('');
                        setNewNumber('');
                        setNotification({message: `${newName} was updated`, success: true});
                    })
                    .catch(() => {
                        setNotification({message: `Failed to update ${newName}`, success: false});
                    });
            }
        } else {
            personsService
                .add({name: newName, number: newNumber})
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson));
                    setNewName('');
                    setNewNumber('');
                    setNotification({message: `${newName} was added`, success: true});
                })
                .catch((err) => {
                    setNotification({message: err.response.data.error, success: false});
                })
        }

        notificationTimeout();
    };

    const removePerson = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            personsService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id));
                });
        }
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    }

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    }

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={notification.message} success={notification.success}/>
            <Filter filter={filter} handle={handleFilterChange}/>
            <h2>Add a new contact</h2>
            <AddContact addPerson={addPerson} handleNameChange={handleNameChange}
                        handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber}/>
            <h2>Contact list</h2>
            <ContactList filteredPersons={filteredPersons} removePerson={removePerson}/>
        </div>
    );
};

export default App;