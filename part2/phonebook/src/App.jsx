import { useState, useEffect } from "react";
import personService from "./services/persons";

// Notification Component
const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={type === "error" ? "error" : "notification"}>{message}</div>
  );
};

const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={searchTerm} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Person = ({ person, deletePerson }) => {
  return (
    <li>
      {person.name} {person.number}{" "}
      <button onClick={() => deletePerson(person.id, person.name)}>
        delete
      </button>
    </li>
  );
};

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Notification states
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const showNotification = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const changedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, changedPerson)
          .then((response) => {
            // FIXED: Update state properly instead of filtering out the person
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : response.data,
              ),
            );
            setNewName("");
            setNewNumber("");

            // Show success notification
            showNotification(`Updated ${newName}'s number`, "success");
          })
          .catch(() => {
            // FIXED: Use the notification banner with "error" type instead of alert
            showNotification(
              `Information of ${newName} has already been removed from server`,
              "error",
            );
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(personObject).then((response) => {
      setPersons(persons.concat(response.data));
      setNewName("");
      setNewNumber("");

      // Show success notification for adding
      showNotification(`Added ${newName}`, "success");
    });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification(`Deleted ${name}`, "success");
        })
        .catch(() => {
          showNotification(
            `Information of ${name} has already been removed from server`,
            "error",
          );
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      {/* Render notification with message and type */}
      <Notification message={message} type={messageType} />

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
