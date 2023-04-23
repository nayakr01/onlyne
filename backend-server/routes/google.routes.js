const express = require('express');
const jwt = require('jsonwebtoken');
const router  = express.Router();
//Rutas para Google

//Ruta para Registrarse
router.get("/auth/google/callback",passport.authenticate("sign-up-google", {scope: ['https://www.googleapis.com/auth/plus.login'], session: false }),
  function (req, res) {
    if (req.user) {
      const token = jwt.sign({id: req.user._id}, 'top_secret', {
        expiresIn: 60 * 60 * 24 //24 horas
      })
      res.cookie('token', token)
    }
  }
);


//rutas para Iniciar Sesion
router.get(
  "/auth/google/signup",
  passport.authenticate("sign-up-google", {scope: ['https://www.googleapis.com/auth/plus.login'], session: false }),
  function (req, res) {
    if (req.user) { 
      const token = jwt.sign({id: req.user._id}, 'top_secret', {
        expiresIn: 60 * 60 * 24 //24 horas
      })
      res.cookie('token', token)
    }
  }
);

export default router;