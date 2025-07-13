import { useState, useEffect } from 'react';
import axios from 'axios';

function useField(type) {
  const [value, setValue] = useState('');

  function onChange(event) {
    setValue(event.target.value);
  }

  return {
    type,
    value,
    onChange
  };
}

function useResource(baseUrl) {
  const [resources, setResources] = useState([]);

  async function create(newObject) {
    const response = await axios.post(baseUrl, newObject);
    setResources(resources.concat(response.data));
    return response.data;
  }

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => setResources(response.data));
  }, []);

  const service = { create };
  return [resources, service];
}

function App() {
  const content = useField('text');
  const name = useField('text');
  const number = useField('text');

  const [notes, noteService] = useResource('http://localhost:3005/notes');
  const [persons, personService] = useResource('http://localhost:3005/persons');

  function handleNoteSubmit(event) {
    event.preventDefault();
    noteService.create({ content: content.value });
  }

  function handlePersonSubmit(event) {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  );
}

export default App;