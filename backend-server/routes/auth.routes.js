const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router  = express.Router();
const userSchema = require('../models/user');
const authorize = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');

//Register
router.post('/register', [
  check('name')
    .not()
    .isEmpty()
    .isLength({ min: 3 })
    .withMessage('Name must be atleast 3 characters long'),
  check('email').not().isEmpty(),
  check('password','Password should be between 5 to 20 characters long')
    .not()
    .isEmpty()
    .isLength({ min: 5, max: 20 })
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
          message: 'User successfully created!',
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

// Sign-in
router.post('/signin', (req, res) => {
  let getUser
  userSchema.findOne({
      email: req.body.email,
    }).then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Authentication failed',
        })
      }
      getUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: 'Authentication failed',
        })
      }
      let jwtToken = jwt.sign(
        {
          email: getUser.email,
          userId: getUser._id,
        },
        'ale-secret-key',
        {
          expiresIn: '1h',
        },
      )
      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        _id: getUser._id,
      })
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Authentication failed',
      })
    })
})

router.post('/login', async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({
        message: 'El email no existe',
      })
    }

    const response = await bcrypt.compare(req.body.password, user.password)
    if (!response) {
      return res.status(401).json({
        message: 'La contraseña es incorrecta',
      })
    }

    const jwtToken = jwt.sign(
      {
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
      message: 'Authentication failed',
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
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: user });
  } catch (error) {
    next(error);
  }
});

// Update User
router.route('/updateuser/:id').put((req, res, next) => {
  userSchema.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
        console.log('User successfully updated!')
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