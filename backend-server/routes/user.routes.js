const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../models/user');

//Setting Express
const app = express();
const port = 3000;
app.use(passport.initialize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Get all users
app.get('/users', (req, res) => {
  User.find()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al recuperar los usuarios."
      });
    });
});

//Create user
app.post('/users', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  user.save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al crear el usuario."
      });
    });
});