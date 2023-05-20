const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router  = express.Router();
const userSchema = require('../models/user');
const listSchema = require('../models/list');
const commentSchema = require('../models/comment');
const authorize = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const { log } = require('console');
const axios = require('axios');
const FormData = require('form-data');

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
        profilePhoto: "public/uploads/avatar1.jpg"
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
        profilePhoto: user.profilePhoto
      },
      'ale-secret-key',
      {
        expiresIn: '24h',
      },
    )

    const refreshToken = jwt.sign({ email: user.email }, "ale-refreshSecret", {
      expiresIn: "48h",
    });

    res.status(200).json({
      token: jwtToken,
      expiresIn: 86400,
      _id: user._id,
      refreshToken: refreshToken
    })

  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: 'Autenticación fallida',
    })
  }
})

// Refresh Token
const { verifyRefresh } = require("../middlewares/helper")
router.post("/refresh", async (req, res) => {
  const { email, refreshToken } = req.body;
  const isValid = verifyRefresh(email, refreshToken);
  if (!isValid) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid token,try login again" });
  }

  const user = await userSchema.findOne({ email: req.body.email })
  if (!user) {
    return res.status(401).json({
      message: 'El email o la contraseña son incorrectos',
    })
  }
  const accessToken = jwt.sign(
      {
        name: user.name,
        email: user.email,
        userId: user._id,
        profilePhoto: user.profilePhoto
      },
      'ale-secret-key',
      {
        expiresIn: '24h',
      },
    )

  const newRefreshToken = jwt.sign({ email: user.email }, "ale-refreshSecret", {
    expiresIn: "48h",
  });
  return res.status(200).json({ success: true, accessToken, newRefreshToken });
});

// Get Users
router.get('/users', authorize, (req, res) => {
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
    const user = await userSchema.findById(req.params.id).populate('lists_created') ;
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
router.route('/updateuser/:id').put(authorize, async (req, res, next) => {
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
        profilePhoto: data.profilePhoto
      },
      'ale-secret-key',
      {
        expiresIn: '24h',
      },
    )

    res.status(200).json({
      token: jwtToken,
      expiresIn: 86400,
      id: data._id,
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
], authorize, async (req, res, next) => {
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
router.route('/deleteuser/:id').delete(authorize, (req, res, next) => {
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

//Upload Profile Photo
// Configuration of multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Folder where photos are saved.
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`
    cb(null, uniqueName);
  }
});

// Middleware configuration of Multer.
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('El archivo seleccionado no es una imagen válida'))
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // Max size: 5MB
  }
});

// Upload Photo Route
router.post('/uploadphoto', authorize, upload.single('profilePhoto'), async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    if (user.profilePhoto && !user.profilePhoto.includes('avatar')) {
      fs.unlink(user.profilePhoto, (err) => {
        if (err) {
          console.log(`Error deleting previous profile photo: ${err}`);
        }
      });
    }
    user.profilePhoto = req.file.path;
    await user.save();
    const jwtToken = jwt.sign(
      {
        name: user.name,
        email: user.email,
        userId: user._id,
        profilePhoto: user.profilePhoto
      },
      'ale-secret-key',
      {
        expiresIn: '24h',
      },
    )
    // Cambiar el nombre del campo _id a id
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      userId: user._id,
      profilePhoto: user.profilePhoto,
      lists_created: user.lists_created,
      lists_favourite: user.lists_favourite,
      ratings: user.ratings
    }
    res.status(200).json({ user: updatedUser, msg: 'Imagen de perfil actualizada correctamente',token: jwtToken,expiresIn: 86400});
  } catch (error) {
    next(error);
  }
});

//View Photo
router.route('/public/uploads/:filename').get((req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../public/uploads', filename);
  res.sendFile(filePath);
});

//Photo default
router.route('/defaultphoto').post(authorize, upload.single('profilePhoto'), async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    if (user.profilePhoto && !user.profilePhoto.includes('avatar')) {
      fs.unlink(user.profilePhoto, (err) => {
        if (err) {
          console.log(`Error deleting previous profile photo: ${err}`);
        }
      });
    }
    user.profilePhoto = req.body.photo;
    await user.save();
    const jwtToken = jwt.sign(
      {
        name: user.name,
        email: user.email,
        userId: user._id,
        profilePhoto: user.profilePhoto
      },
      'ale-secret-key',
      {
        expiresIn: '24h',
      },
    )
    // Cambiar el nombre del campo _id a id
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      userId: user._id,
      profilePhoto: user.profilePhoto,
      lists_created: user.lists_created,
      lists_favourite: user.lists_favourite,
      ratings: user.ratings
    }
    res.status(200).json({ 
      user: updatedUser, 
      msg: 'Imagen de perfil actualizada correctamente', 
      token: jwtToken, 
      expiresIn: 86400
    });
  } catch (error) {
    next(error);
  }
});

// Get All Lists
router.get('/lists', (req, res) => {
  listSchema.find()
    .populate('author', 'name email')
    .then(lists => {
      res.send(lists);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al recuperar las listas."
      });
    });
});

// Get List by ID
router.get('/lists/:id', (req, res) => {
  const listId = req.params.id;

  listSchema.findById(listId)
    .populate('author', 'name email')
    .then(list => {
      if (!list) {
        return res.status(404).json({ message: 'Lista no encontrada' });
      }
      
      res.json(list);
    })
    .catch(err => {
      res.status(500).json({ error: err.message || 'Error al buscar la lista' });
    });
});

// Get All Lists of a Specific User
router.get('/users/:userId/lists', authorize, (req, res) => {
  const userId = req.params.userId;

  userSchema.findById(userId)
    .then(user => {
      const listIds = user.lists_created;
      listSchema.find({ _id: { $in: listIds } })
        .populate('author', 'name email') // Populate the 'author' field with the 'name' and 'email' properties
        .then(lists => {
          res.send(lists);
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Error al recuperar las listas del usuario."
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al recuperar el usuario."
      });
    });
});

//Create List
router.post('/lists', authorize, (req, res) => {
  const newList = new listSchema({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    listPhoto: 'public/uploads/default-image-list.png',
    listM_S: [],
    visibility: req.body.visibility
  });
  newList.save()
    .then(response => {
      userSchema.findById(req.body.author)
        .then(user => {
          user.lists_created.push(response._id);
          user.save()
            .then(() => {
              res.status(201).json({
                message: 'Lista creada con éxito!',
                result: response,
              });
            })
            .catch(error => {
              res.status(400).json({ error: error.message });
            });
        })
        .catch(error => {
          res.status(400).json({ error: error.message });
        });
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

// Update List
router.put('/lists/:id', authorize, (req, res) => {
  const listId = req.params.id;

  listSchema.findByIdAndUpdate(listId, req.body, { new: true })
    .then(updatedList => {
      if (!updatedList) {
        return res.status(404).json({ message: 'La lista no se encontró.' });
      }

      res.status(200).json({ message: 'Lista actualizada correctamente.', result: updatedList });
    })
    .catch(error => {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Ya existe una lista con ese nombre.' });
      }

      res.status(400).json({ error: error.message });
    });
});

// Delete List
router.delete('/lists/:id', authorize, (req, res) => {
  const listId = req.params.id;

  listSchema.findByIdAndDelete(listId)
    .then(deletedList => {
      if (!deletedList) {
        return res.status(404).json({ message: 'La lista no se encontró.' });
      }

      // Remove the list ID from the user's lists_created array
      userSchema.findByIdAndUpdate(deletedList.author, { $pull: { lists_created: listId } })
        .then(() => {
          res.status(200).json({ message: 'Lista eliminada correctamente.' });
        })
        .catch(error => {
          res.status(400).json({ error: error });
        });
    })
    .catch(error => {
      res.status(400).json({ error: error });
    });
});

// Upload List Photo Route
router.post('/uploadListPhoto', authorize, upload.single('listPhoto'), async (req, res, next) => {
  try {
    const list = await listSchema.findById(req.body.listId);
    if (!list) {
      return res.status(404).json({ msg: 'Lista no encontrada' });
    }
    if (list.listPhoto && !list.listPhoto.includes('default-image')) {
      fs.unlink(list.listPhoto, (err) => {
        if (err) {
          console.log(`Error deleting previous list photo: ${err}`);
        }
      });
    }
    list.listPhoto = req.file.path;
    await list.save();
    res.status(200).json({ list: list, msg: 'Imagen de lista actualizada correctamente'});
  } catch (error) {
    next(error);
  }
});

// Add Movie or Series to User's List
router.post('/users/:userId/lists/:listId/items', authorize, async (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;
  const itemId = req.body;

  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const list = await listSchema.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    list.listM_S.push(itemId);

    await list.save();

    res.status(201).json({ status: 201, message: 'Elemento añadido a la lista con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove Movie or Series from User's List
router.delete('/users/:userId/lists/:listId/items', authorize, async (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;
  const itemId = req.body;

  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const list = await listSchema.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    let itemIndex;

    if (itemId.serieId) {
      itemIndex = list.listM_S.findIndex(item => item.serieId == itemId.serieId);
      if (itemIndex === -1 ) {
        return res.status(404).json({ message: 'El elemento no está presente en la lista' });
      }
    }

    if (itemId.movieId) {
      itemIndex = list.listM_S.findIndex(item => item.movieId == itemId.movieId);
      if (itemIndex === -1 ) {
        return res.status(404).json({ message: 'El elemento no está presente en la lista' });
      }
    }

    list.listM_S.splice(itemIndex, 1);

    await list.save();

    res.status(200).json({ status: 200, message: 'Elemento eliminado de la lista con éxito', list: list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if Serie or Movie exists on the List
router.post('/lists/:listId/checkItem', authorize, async (req, res) => {
  const listId = req.params.listId;
  const itemId = req.body;

  try {
    const list = await listSchema.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    if(itemId.serieId) {
      const isItemAdded = list.listM_S.some(item => item.serieId === itemId.serieId);
      if (isItemAdded)return res.status(200).json({ status: 200, message: 'La serie ya está añadida a la lista.' });
    }
    
    if(itemId.movieId) {
      const isItemAdded = list.listM_S.some(item => item.movieId === itemId.movieId);
      if (isItemAdded) return res.status(200).json({ status: 200, message: 'La película ya está añadida a la lista.' });
    }

    res.status(404).json({ error: "La película o serie no está añadida a la lista." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Favorite Lists of a Specific User
router.get('/users/:userId/favouriteLists', authorize, (req, res) => {
  const userId = req.params.userId;

  userSchema.findById(userId)
    .then(user => {
      const listIds = user.lists_favourite;
      listSchema.find({ _id: { $in: listIds } })
        .populate('author', 'name email') // Populate the 'author' field with the 'name' and 'email' properties
        .then(lists => {
          res.send(lists);
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Error al recuperar las listas favoritas del usuario."
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al recuperar el usuario."
      });
    });
});

// Add List to Favourites
router.post('/users/:userId/favourites', authorize, async (req, res) => {
  const userId = req.params.userId;
  const listId = req.body.listId;

  try {
    const user = await userSchema.findById(userId);
    if (user.lists_created.includes(listId)) {
      return res.status(400).json({ message: 'No puedes agregar tus propias listas a favoritos' });
    }

    if (user.lists_favourite.includes(listId)) {
      return res.status(400).json({ message: 'La lista ya está en favoritos' });
    }

    user.lists_favourite.push(listId);
    await user.save();

    const list = await listSchema.findById(listId);
    if (list) {
      list.followers.push(userId);
      await list.save();
    }

    res.status(200).json({ message: 'Lista agregada a favoritos correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la lista a favoritos' });
  }
});

// Remove List from Favourites
router.delete('/users/:userId/favourites/:listId', authorize, async (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;

  try {
    const user = await userSchema.findById(userId);
    if (!user.lists_favourite.includes(listId)) {
      return res.status(400).json({ message: 'La lista no está en favoritos' });
    }

    const index = user.lists_favourite.indexOf(listId);
    if (index > -1) {
      user.lists_favourite.splice(index, 1);
      await user.save();
    }

    const list = await listSchema.findById(listId);
    if (list) {
      const followerIndex = list.followers.indexOf(userId);
      if (followerIndex > -1) {
        list.followers.splice(followerIndex, 1);
        await list.save();
      }
    }

    res.status(200).json({ message: 'Lista eliminada de favoritos correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la lista de favoritos' });
  }
});

// Get Followers Count of a list
router.get('/lists/:listId/followers/count', authorize, async (req, res) => {
  try {
    const listId = req.params.listId;

    const list = await listSchema.findById(listId).exec();
    if (!list) {
      return res.status(404).json({ error: 'La lista no existe' });
    }

    const followersCount = list.followers.length;
    return res.json({ count: followersCount });
  } catch (error) {
    console.error('Error al obtener el número de seguidores de la lista:', error);
    return res.status(500).json({ error: 'Error al obtener el número de seguidores de la lista' });
  }
});

// Get all comments from a movie.
router.get('/movies/:movieId/comment', async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const comments = await commentSchema.find({ 'movieSerieId.id': movieId, 'movieSerieId.type': 'movie' })
      .populate('userId', 'name profilePhoto');

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los comentarios de la película' });
  }
});

// Get all comments from a serie.
router.get('/series/:serieId/comment', async (req, res) => {
  try {
    const serieId = req.params.serieId;

    const comments = await commentSchema.find({ 'movieSerieId.id': serieId, 'movieSerieId.type': 'serie' })
      .populate('userId', 'name profilePhoto');

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los comentarios de la película' });
  }
});

// Add comment to the Movie
router.post('/movies/:id/comment', async (req, res) => {
  try {
    const movieId = req.params.id;
    const comment = req.body.comment;
    const userId = req.body.userId;
    const rating = req.body.rating;

    // Create FormData and append necessary data
    const data = new FormData();
    data.append('text', comment);
    data.append('lang', 'es,en,fr,it,pt');
    data.append('mode', 'standard');
    data.append('api_user', '898220282');
    data.append('api_secret', 'Q24E3awwVhDYskg2EEEz');

    // Make a POST request to the offensive language check API
    const response = await axios({
      url: 'https://api.sightengine.com/1.0/text/check.json',
      method: 'post',
      data: data,
      headers: data.getHeaders()
    });

    // Check the response for offensive language
    if (response.data?.profanity?.matches.length > 0 || response.data?.link?.matches.length > 0) {
      console.log("-----------------Matches-----------------------------");
      console.log(response.data.profanity?.matches);
      console.log(response.data.link?.matches);
      // Offensive language found, handle accordingly
      res.status(400).json({ profanity: response.data.profanity?.matches, link: response.data?.link?.matches , message: 'El comentario contiene lenguaje ofensivo o algún link' });
    } else {
      const newComment = new commentSchema({
        movieSerieId: {id: movieId, type: "movie"},
        userId: userId,
        comment: comment,
        rating: rating
      });

      await newComment.save();

      res.status(201).json({ message: 'Comentario agregado exitosamente' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el comentario a la película' });
  }
});

// Add comment to the Serie
router.post('/series/:id/comment', async (req, res) => {
  try {
    const serieId = req.params.id;
    const comment = req.body.comment;
    const userId = req.body.userId;
    const rating = req.body.rating;

    // Create FormData and append necessary data
    const data = new FormData();
    data.append('text', comment);
    data.append('lang', 'es,en,fr,it,pt');
    data.append('mode', 'standard');
    data.append('api_user', '898220282');
    data.append('api_secret', 'Q24E3awwVhDYskg2EEEz');

    // Make a POST request to the offensive language check API
    const response = await axios({
      url: 'https://api.sightengine.com/1.0/text/check.json',
      method: 'post',
      data: data,
      headers: data.getHeaders()
    });

    // Check the response for offensive language
    if (response.data?.profanity?.matches.length > 0 || response.data?.link?.matches.length > 0) {
      console.log("-----------------Matches-----------------------------");
      console.log(response.data.profanity?.matches);
      console.log(response.data.link?.matches);
      // Offensive language found, handle accordingly
      res.status(400).json({ profanity: response.data.profanity?.matches, link: response.data?.link?.matches , message: 'El comentario contiene lenguaje ofensivo o algún link' });
    } else {
      const newComment = new commentSchema({
        movieSerieId: { id: serieId, type: 'serie' },
        userId: userId,
        comment: comment,
        rating: rating
      });

      await newComment.save();

      res.status(201).json({ message: 'Comentario agregado exitosamente' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el comentario a la serie' });
  }
});

// Delete a comment from a movie.
router.delete('/comment/:commentId', async (req, res) => {
  try {
    const commentId = req.params.commentId;

    await commentSchema.findByIdAndRemove(commentId);

    res.status(200).json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el comentario' });
  }
});

module.exports = router;