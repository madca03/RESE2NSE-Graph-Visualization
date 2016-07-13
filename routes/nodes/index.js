var router = require('express').Router();

router.get('/', require('./get-nodes.js'));
router.get('/count', require('./get-node-count.js'));

module.exports = router;
