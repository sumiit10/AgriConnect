const express = require('express');
const controller = require('../controllers/rentalController');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();
router.use(requireLogin);
router.post('/', controller.create);
router.get('/mine', controller.mine);
router.patch('/:id/status', controller.updateStatus);

module.exports = router;
