const express = require('express');
const middleware = require('../../Middlewares/authentications');
const Controller = require('./controller');

const router = express.Router();

router.post('/', middleware.authenticateToken, Controller.Create);
router.get('/', middleware.authenticateToken, Controller.List);
router.patch('/like/:id', middleware.authenticateToken, Controller.Like);
router.patch('/:id', middleware.authenticateToken, Controller.Update);
router.delete('/:id', middleware.authenticateToken, Controller.Delete);
router.get('/:id', middleware.authenticateToken, Controller.Read);

module.exports = router;