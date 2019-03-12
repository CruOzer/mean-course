const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

  try {
    // split because of Berear UIFNUIDN
    const token = req.headers.authorization.split(" ")[1];
    // Verify token
    jwt.verify(token, process.env.PRIVATE_KEY) // can throw error
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed.'
    });
  }

}
