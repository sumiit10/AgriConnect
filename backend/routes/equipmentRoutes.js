const express = require('express');
const controller = require('../controllers/equipmentController');
const { requireLogin, requireOwner } = require('../middleware/auth');

const router = express.Router();
router.get('/', controller.list);
router.get('/mine', requireLogin, requireOwner, controller.mine);
router.get('/:id', controller.getById);
router.post('/', requireLogin, requireOwner, controller.create);
router.put('/:id', requireLogin, requireOwner, controller.update);
router.delete('/:id', requireLogin, requireOwner, controller.remove);

module.exports = router;
