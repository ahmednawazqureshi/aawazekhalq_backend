const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  const header = req.headers['authorization']
  if(!header) return res.status(401).json({message:'No token'})
  const token = header.split(' ')[1]
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = data
    next()
  } catch (e) {
    return res.status(401).json({message:'Invalid token'})
  }
}
