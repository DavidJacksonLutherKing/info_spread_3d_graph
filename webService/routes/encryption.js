var express = require('express');
var router = express.Router();

router.get('/unencrypt/nickname/:nickname', function (req, res, next) {
    //设置允许跨域请求
    var reqOrigin = req.header("origin");

    if (reqOrigin != undefined && reqOrigin.indexOf("http://localhost:3000") > -1) {
        //设置允许 http://localhost:3000 这个域响应
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    }

    res.send(req.params.nickname + "-tagged");
});

module.exports = router;