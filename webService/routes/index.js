var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Transmission' });
});
/* GET Open Id 生成器. */
router.get('/open_id_generator', function(req, res, next) {
  res.render('open_id_generator', { title: 'Open ID Generator' });
});

module.exports = router;
