var express = require('express');
var router = express.Router();
var generator = require("../util/generator");
var fs = require("fs");
var path = require('path')

router.get('/generate_node/:num', function (req, res, next) {
    var tree = generator.generate_tree_by_num(req.params.num);
    var filepath = path.resolve(__dirname,""); 
    // console.log(path);
    fs.writeFile(__dirname+'/../public/data/' + req.params.num + '-nodes-tree.json', tree, function (err) {
        if (err) {
            res.status(500).send(JSON.stringify(err),"","\t");
        }else{
            res.send("done<a href='/ajax/generate_node/download/"+ req.params.num + "-nodes-tree.json'>"+ req.params.num + "-nodes-tree.json</a>");
        }       
    });
   
});

router.get('/generate_node/download/:filename', function (req, res, next) {
    var name = req.params.filename;
    var filepath = path.resolve(__dirname,"..")+'/public/data/'+name; 
    console.log(filepath);
    var size = fs.statSync(filepath).size;
    var f = fs.createReadStream(filepath);
    res.writeHead(200, {
      'Content-Type': 'application/force-download',
      'Content-Disposition': 'attachment; filename=' + name,
      'Content-Length': size
    });
    f.pipe(res);
});

module.exports = router;