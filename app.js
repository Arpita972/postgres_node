const client = require("./connection.js");
const express = require("express");
//import express from 'express';
//import client from './connection.js';
const app = express();
const port = process.env.PORT || "3300";
const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
//import bodyParser from 'body-parser';
app.use(bodyParser.json());
client.connect();

//get all users
app.get("/users", (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});

//get all courses
app.get("/courses", (req, res) => {
  client.query(`Select * from course`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});

//film report
app.get("/film", (req, res) => {
  client.query(
    `with t1 as (select actor_id,first_name,last_name from actor),
t2 as (select actor_id,film_id from film_actor),
t3 as (select film_id,title,description from film),
t4 as (select a.actor_id,first_name,last_name,film_id from t1 a,t2 b  where a.actor_id=b.actor_id),
t5 as (select a.film_id,title,description ,actor_id,first_name,last_name 
	   from t3 a,t4 b where a.film_id=b.film_id),
t6 as(select film_id, inventory_id,store_id from inventory)
select * from t5 a,t6 b where a.film_id=b.film_id`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});

//get a particular user
app.get("/users/:id", (req, res) => {
  client.query(
    `Select * from users where id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});

//Add an user
app.post("/userinsert", (req, res) => {
  const user = req.body;
  let insertQuery = `insert into users(id, name) 
                       values(${user.id}, '${user.name}')`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

//update user
app.put("/userupdate/:id", (req, res) => {
  let user = req.body;
  let updateQuery = `update users
                       set name = '${user.name}'
                       where id = ${user.id}`;

  client.query(updateQuery, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

//delete an user
app.delete("/userdel/:id", (req, res) => {
  let insertQuery = `delete from users where id=${req.params.id}`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Deletion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
