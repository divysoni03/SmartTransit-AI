const express = require('express');
const { authController } = require('../controllers');
const auth = require('../middleware/auth.middleware');
// For validation we would normally use a validation middleware, but for simplicity
// we'll rely on our controller logic or add a small wrapper if needed.
// A common pattern is using joi with a middleware like `validate` (not implemented here perfectly yet, 
// but we have the validator files prepared).

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth(), authController.getMe);

module.exports = router;
