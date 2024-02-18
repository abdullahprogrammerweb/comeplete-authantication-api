import jwt from 'jsonwebtoken'
import User from "../models/User.js"

var checkUserAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

      // Get User from Token
      req.user = await User.findById(userID).select('-password')
      console.log("req is herer",req)

      next()
    } catch (error) {
      console.log(error)
      res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
}

export default checkUserAuth


// $2b$10$h4P503qnusPeF2Rlg197LOtFwZyupxqIAJi4EEHVVtW3Z56IBFnE2
// $2b$10$h4P503qnusPeF2Rlg197LOtFwZyupxqIAJi4EEHVVtW3Z56IBFnE2
// $2b$10$QUGShiyNRK1GXTcYthAbPuFE0X5g22JnorIjIcF3sXqHW1ncbf.6G
// $2b$10$vIah84E6lABA3w3AYc1KXe8JcEzkZ1NmPzIKktGtbwv6SCCo5ntaq"