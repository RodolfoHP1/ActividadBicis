let express = require('express');
let router = express.Router();
let usuariosController = require('../controllers/usuarios')


router.get('/', usuariosController.list)
router.get('/welcome', usuariosController.welcome)
router.get('/create', usuariosController.create_get)
router.post('/create', usuariosController.create)
router.get('/login', usuariosController.login_get)
router.post('/login', usuariosController.login)
router.get('/:id/update', usuariosController.update_get)
router.post('/:id/update', usuariosController.update)
router.post('/:id/delete', usuariosController.delete)

module.exports = router;

