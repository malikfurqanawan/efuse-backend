const PostModel = require("./model");
const Redis = require("../../Redis/connection");

module.exports = {
  Create: async (req, res) => {
    try {
      let post = {},
        redisPosts = [];
        req.body.user = req.decoded._id;
      post = await PostModel.create(req.body);
      post = await PostModel.findOne({ _id: post.id }).lean();
      const redisPostString = await Redis.get("posts");
      redisPosts = redisPostString ? JSON.parse(redisPostString) : []
      redisPosts.push(post);
      Redis.set("posts", JSON.stringify(redisPosts));
      return res.status(200).json({
        status: true,
        message: "You have successfully posted.",
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Read: async (req, res) => {
    try {
      let post = {},
        redisPosts = [];
        const redisPostString = await Redis.get('posts')
        redisPosts = redisPostString ? JSON.parse(redisPostString) : [];
      if (redisPosts.length > 0) {
        const redisPost = redisPosts.filter((rp) => rp._id === req.params.id);
        post = redisPost[0];
      }
      if (!post) {
        post = await PostModel.findOne({ _id: req.params.id });
      }
      return res.status(200).json({
        status: true,
        data: post,
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
        await PostModel.updateOne({_id: id}, {
            $set: req.body
        });
        const posts = await PostModel.find({}).lean();
        Redis.set('posts', JSON.stringify(posts));
        return res.status(200).json({
            status: true,
            message: 'post Updated successfully.'
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
        let redisPosts = [];
        await posts.deleteOne({_id: req.params.id});
        const redisPostString = await Redis.get('posts')
        redisPosts = redisPostString ? JSON.parse(redisPostString) : [];
        redisPosts = redisPosts.filter(post => post._id !== req.params.id);
        Redis.set('posts', JSON.stringify(redisPosts));
        return res.status(200).json({
            status: true,
            message: 'post deleted Successfully'
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
        let posts = [], redisPosts;
        const redisPostString = await Redis.get('posts')
        redisPosts = redisPostString ? JSON.parse(redisPostString) : [];
        if (redisPosts.length > 0) {
            posts = redisPosts
        } else {
            posts = await PostModel.find({}).lean();
            if(posts.length > 0) {
              Redis.set('posts', JSON.stringify(posts));
            }
        }
        return res.status(200).json({
            status: true,
            data: posts
        });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Like: async (req, res) => {
    try {
      const id = req.params.id;
      let posts = [];
      await PostModel.updateOne({_id: id}, {
        $pull: {
          likes: req.decoded._id
        }
      });
      await PostModel.updateOne({_id: id}, {
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
};
