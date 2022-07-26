const CommentModel = require('./model');
const PostModel = require('../Posts/model');

const Redis = require("../../Redis/connection");

module.exports = {
    Create: async (req, res) => {
        try {
            let comment = {}, posts = [];
            req.body.user = req.decoded._id;
            comment = await CommentModel.create(req.body);
            await PostModel.updateOne({_id: req.body.postId}, {
                $push: {
                    comments: comment.id
                }
            });
            posts = await PostModel.find({}).lean();
            Redis.set('posts', JSON.stringify(posts));
            return res.status(200).json({
                status: true,
                message: 'Your comment has posted successfully',
                data: posts
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
    Delete: async (req, res) => {
        try {
            const id = req.params.id;
            let posts = [];
            await CommentModel.deleteOne({_id: id});
            await PostModel.updateOne({comments: id}, {
                $pull: {
                    comments: id
                }
            });
            posts = await PostModel.find({}).lean();
            Redis.set('posts', JSON.stringify(posts));
            return res.status(200).json({
                status: true,
                message: 'Your comment has been deleted successfully',
                data: posts
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
    Update: async (req, res) => {
        try {
            const id = req.params.id;
            let posts = [];
            await CommentModel.updateOne({_id: id}, {
                $set: req.body
            });
            posts = await PostModel.find({}).lean();
            Redis.set('posts', JSON.stringify(posts));
            return res.status(200).json({
                status: true,
                message: 'Your comment has been updated successfully',
                data: posts
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
    Like: async (req, res) => {
      try {
        const id = req.params.id;
        let posts = [];
        await CommentModel.updateOne({_id: id}, {
          $pull: {
            likes: req.decoded._id
          }
        });
        await CommentModel.updateOne({_id: id}, {
          $push: {
            likes: req.decoded._id
          }
        });
        posts = await PostModel.find({}).lean()
        Redis.set('posts', JSON.stringify(posts));
        return res.status(200).json({
          status: true,
          message: 'Like Successful',
          data: posts
        });
      } catch (error) {
        return res.status(500).json({
          status: false,
          message: error.message
        });
      }
    }
}