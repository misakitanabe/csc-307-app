import express from "express";
import cors from "cors";

import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/users", async (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  console.log(name, job);
  
  userServices.getUsers(name, job)
    .then(result => {
      res.send({ users_list: result });
    })
    .catch(error =>  {
      console.log(error);
      res.status(500).send("An error ocurred in the server.");
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userServices.findUserById(id)
    .then(result => {
      if (result === undefined) {
        res.status(404).send("Resource not found.");
      } else {
        res.send({ users_list: result });
      }
    });
});

  
app.post("/users", (req, res) => {
    const userToAdd = req.body;
    userServices.addUser(userToAdd)
      .then(result => {
        res.status(201).send({ users_list: result });
      })
      .catch(error =>  {
        console.log(error);
        res.status(500).send("An error ocurred in the server.");
      });
});


// TODO: update this to use DB 
app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userServices.deleteUser(id) 
      .then(result => {
        if (result) {
          console.log("Deleted user with id: ", id);
          res.status(204).send();
        } else {
          res.status(404).send("Resource not found.");
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("An error ocurred in the server.");
      })
  });
  

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

// to run: npm run dev