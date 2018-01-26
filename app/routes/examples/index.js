'use strict';

const router = require('express').Router();

// /examples/readme will be sent to get-markdown.js handler.
router.get('/readme', require('../get-markdown.js'));
// All other will be sent to this handler.
router.get('/*', require('../get-html.js'));

module.exports = router;
