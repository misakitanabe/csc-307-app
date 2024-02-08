// src/MyApp.js
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";


function MyApp() {
    const [characters, setCharacters] = useState([])

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
      }, [] );

    function removeOneCharacter(charId) {
        fetch(`Http://localhost:8000/users/${charId}`, {
          method: "DELETE"
        })
        .then(response => {
            if (response.status === 204) {
                const updated = characters.filter((character) => {
                    return character._id !== charId;
                });
                setCharacters(updated);
            } else {
                throw new Error(`Delete: Unexpected status code ${response.status}`);
            }
        })
        .catch((error) => {
            console.log(error);
        }) 
    }

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
            .then(response => {
                if (response.status === 201) {
                    response.json().then(newUser => {
                        setCharacters([...characters, newUser]); // not appending new user
                        console.log("characters: ", characters);
                        console.log("new: ", newUser);
                    });                    
                } 
                else {
                    throw new Error(`Post: Unexpected status code ${response.status}`);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    return (
        <div className="container">
            <Table 
                characterData={characters}
                removeCharacter = {removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;

// to run: npm start