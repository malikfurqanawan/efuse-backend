const UserModel = require('./model');

const signUpValidation = async (req, res, next) => {
  try {
    let user = {};
    user = await UserModel.findOne({email: req.body.email});
    if (user) {
      return res.status(400).json({
        status: false,
        errMessage: 'Email already taken'
      });
    }
    user = await UserModel.findOne({userName: req.body.userName});
    if (user) {
      return res.status(400).json({
        status: false,
        errMessage: 'Email already taken'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }

};

module.exports = {
  signUpValidation
}