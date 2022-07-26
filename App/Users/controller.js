const UserModel = require("./model");
const Redis = require("../../Redis/connection");

const jwt = require('jsonwebtoken');

const environment = require("dotenv");
environment.config();

module.exports = {
  Create: async (req, res) => {
    try {
      let user = {},
        token = null,
        redisUsers = [];
      user = await UserModel.create(req.body);
      token = jwt.sign({ _id: user.id.toString() }, process.env.TOKEN_SECRET);
      await UserModel.updateOne(
        { _id: user.id },
        {
          token: token,
        }
      );
      user = await UserModel.findOne({ _id: user.id }, { password: 0 }).lean();
      const redisUserString = await Redis.get("users");
      redisUsers = redisUserString ? JSON.parse(redisUserString) : []
      redisUsers.push(user);
      Redis.set("users", JSON.stringify(redisUsers));
      return res.status(200).json({
        status: true,
        message: "You have registered Successfully.",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Login: async (req, res) => {
    try {
        let user = {};
        user = await UserModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(401).json({
                status: false,
                errMessage: 'Email/Password Incorrect'
            });
        }
        const isMatched = await user.comparePassword(req.body.password);
        if (!isMatched) {
            return res.status(401).json({
                status: false,
                errMessage: 'Email/Password Incorrect'
            });
        }
        user.password = undefined;
        return res.status(200).json({
            status: true,
            message: 'Login successful',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: true,
            message: error.message
        });
    }
  },
  Read: async (req, res) => {
    try {
      let user = {},
        redisUsers = [];
      redisUsers = JSON.parse(Redis.get("users"));
      if (redisUsers.length > 0) {
        const redisUser = redisUsers.filter((ru) => ru.id === req.params.id);
        user = redisUser[0];
      }
      if (!user) {
        user = await UserModel.findOne({ _id: req.params.id }, { password: 0 });
      }
      return res.status(200).json({
        status: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Update: async (req, res) => {
    try {
        const id = req.params.id;
        await UserModel.updateOne({_id: id}, {
            $set: req.body
        });
        const users = await UserModel.find({}, {password: 0}).lean();
        Redis.set('users', JSON.stringify(users));
        return res.status(200).json({
            status: true,
            message: 'User Updated successfully.'
        });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Delete: async (req, res) => {
    try {
        let redisUsers = [];
        await Users.deleteOne({_id: req.params.id});
        redisUsers = JSON.parse(Redis.get('users'));
        redisUsers = redisUsers.filter(user => user.id !== req.params.id);
        Redis.set('users', JSON.stringify(redisUsers));
        return res.status(200).json({
            status: true,
            message: 'User deleted Successfully'
        });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  List: async (req, res) => {
    try {
        let users = [], redisUsers;
        redisUsers = JSON.parse(Redis.get('users'));
        if (redisUsers.length > 0) {
            users = redisUsers
        } else {
            users = await Users.find({}, {password: 0});
            Redis.set('users', JSON.stringify(users))
        }
        return res.status(200).json({
            status: true,
            data: users
        });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
};
