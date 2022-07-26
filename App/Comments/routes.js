const express = require('express');
const middleware = require('../../Middlewares/authentications');
const Controller = require('./controller');

const router = express.Router();

router.post('/', middleware.authenticateToken, Controller.Create);
router.patch('/like/:id', middleware.authenticateToken, Controller.Like);
router.patch('/:id', middleware.authenticateToken, Controller.Update);
router.delete('/:id', middleware.authenticateToken, Controller.Delete);

module.exports = router;