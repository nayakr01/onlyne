const jwt = require("jsonwebtoken");

function verifyRefresh(email, token) {
  try {
   const decoded = jwt.verify(token, "ale-refreshSecret");
   return decoded.email === email;
  } catch (error) {
   console.error(error);
   return false;
  }
 }
 module.exports = { verifyRefresh };