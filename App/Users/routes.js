const express = require('express');
const middleware = require('../../Middlewares/authentications');
const validations = require('./validations');
const Controller = require('./controller');

const router = express.Router();

router.post('/', validations.signUpValidation, Controller.Create);
router.post('/login', Controller.Login)
router.get('/', middleware.authenticateToken, Controller.List);
router.patch('/:id', middleware.authenticateToken, Controller.Update);
router.delete('/:id', middleware.authenticateToken, Controller.Delete);
router.get('/:id', middleware.authenticateToken, Controller.Read);

module.exports = router;