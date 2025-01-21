// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(id) {
    // Make DELETE request to backend
    fetch(`http://localhost:8000/users/${id}`, {
        method: 'DELETE'
    })
    .then((response) => {
        if (response.status === 204) {
            // Only update frontend state if backend delete was successful
            const updated = characters.filter((character) => character.id !== id);
            setCharacters(updated);
        } else if (response.status === 404) {
            console.log('User not found');
        }
    })
    .catch((error) => {
        console.log('Error deleting user:', error);
    });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) { 
    postUser(person)
      .then((response) => {
        // Check if server returned 201 (Created) status
        if (response.status === 201) {
          // Get complete user object with ID
          return response.json();
        }
        throw new Error('Failed to create user');
      })
      .then((newUser) => {
        // Update state with complete user object from server
        setCharacters([...characters, newUser])
      })
      .catch((error) => {
        // Log any request errors
        console.log(error);
      });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;