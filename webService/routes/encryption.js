var express = require('express');
var router = express.Router();

router.get('/unencrypt/nickname/:nickname', function(req, res, next) {
    res.send(req.params.nickname+"-tagged");
});

module.exports = router;