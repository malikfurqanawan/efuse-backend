const users = require('../App/Users/routes');
const posts = require('../App/Posts/routes');
const comments = require('../App/Comments/routes');

module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/posts', posts)
  app.use('/api/comments', comments)
}