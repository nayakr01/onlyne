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
router.route('/updateuser/:id').put(async (req, res, next) => {
  const newName = req.body.name;
  
  const existingUser = await userSchema.findOne({ name: newName });
  if (existingUser) {
    return res.status(422).json({ msg: 'El nombre de usuario ya está en uso' });
  }

  let updateFields = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.password) {
    const newPassword = req.body.password;
    const hash = await bcrypt.hash(newPassword, 10);
    updateFields.password = hash;
  } 
  try {
    const data = await userSchema.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    const { password, ...userWithoutPassword } = data.toObject();
    const { _id, ...rest } = userWithoutPassword;
    const newData = { id: _id.toString(), ...rest };
    console.log('¡Usuario modificado con éxito!');
    const jwtToken = jwt.sign(
      {
        name: data.name,
        email: data.email,
        userId: data._id,
      },
      'ale-secret-key',
      {
        expiresIn: '1h',
      },
    )

    res.status(200).json({
      token: jwtToken,
      expiresIn: 3600,
      _id: data._id,
      client: newData
    })
  } catch (error) {
    next(error);
  }
});

// Update Password User
router.route('/updatepassworduser/:id').put([
  check('currentPassword').not().isEmpty().withMessage('La contraseña actual es obligatoria'),
  check('newPassword').not().isEmpty().isLength({ min: 5, max: 50 }).withMessage('La contraseña debe tener entre 5 y 50 caracteres'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const user = await userSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }
    
    const hash = await bcrypt.hash(newPassword, 10);
    const data = await userSchema.findByIdAndUpdate(req.params.id, { password: hash }, { new: true });
    const { password, ...userWithoutPassword } = data.toObject();
    res.status(200).json(userWithoutPassword);
    console.log('Contraseña modificada con éxito!');
  } catch (error) {
    next(error);
  }
});

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