const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

  try {
    // split because of Berear UIFNUIDN
    const token = req.headers.authorization.split(" ")[1];
    // Verify token
    const decodedToken = jwt.verify(token, process.env.PRIVATE_TOKEN) // can throw error
    req.userData = {
      email: decodedToken,
      id: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed.' + error
    });
  }

}
