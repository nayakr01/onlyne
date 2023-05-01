const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router  = express.Router();
const userSchema = require('../models/user');
const authorize = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');

// Register
router.post('/register', [
  check('name')
    .not()
    .isEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener al menos 3 caracteres de longitud.'),
  check('email')
    .not()
    .isEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Email no válido'),
  check('password','La contraseña debe tener entre 5 y 50 caracteres de longitud.')
    .not()
    .isEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 5, max: 50 })
    .withMessage('La contraseña debe tener entre 5 y 50 caracteres de longitud.'),
], (req, res, next) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  } else {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new userSchema({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })
    user.save().then((response) => {
        res.status(201).json({
          message: '¡Usuario creado con éxito!',
          result: response,
        })
      }).catch((error) => {
          res.status(500).json({
          error: error,
        })
      })
    })
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({
        message: 'El email o la contraseña son incorrectos',
      })
    }

    const response = await bcrypt.compare(req.body.password, user.password)
    if (!response) {
      return res.status(401).json({
        message: 'El email o la contraseña son incorrectos',
      })
    }

    const jwtToken = jwt.sign(
      {
        name: user.name,
        email: user.email,
        userId: user._id,
      },
      'ale-secret-key',
      {
        expiresIn: '1h',
      },
    )

    res.status(200).json({
      token: jwtToken,
      expiresIn: 3600,
      _id: user._id,
    })

  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: 'Autenticación fallida',
    })
  }
})

// Get Users
router.get('/users', (req, res) => {
  userSchema.find()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al recuperar los usuarios."
      });
    });
});

// Get Single User
router.route('/userprofile/:id').get(authorize, async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    // Devolver el objeto "user" sin la propiedad "password"
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ msg: userWithoutPassword });
  } catch (error) {
    next(error);
  }
});

// Update User
router.route('/updateuser/:id').put((req, res, next) => {
  userSchema.findByIdAndUpdate(req.params.id,{$set: req.body,},
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
        console.log('¡Usuario modificado con éxito!')
      }
    },
  )
})

// Delete User
router.route('/deleteuser/:id').delete((req, res, next) => {
  userSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  })
})

module.exports = router;