const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');

//Setting Express
const app = express();
const port = 3000;
app.use(passport.initialize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}));

//DB conexion
mongoose.connect('mongodb+srv://ale:ale@cluster-onlyne.t0txeqv.mongodb.net/Onlyne?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((c) => {
  console.log('Connected to Mongo, DB:', c.connections[0].name);
}).catch(err => {
  console.log('Error connecting to mongo', err);
  process.exit();
});

const auth = require('./routes/auth.routes');
const path = require('path');
app.use('/api', auth);

app.listen(port, () => {
  console.log('Server started on port 3000');
});