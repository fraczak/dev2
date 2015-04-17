var express = require('express'),
    multer  = require('multer'),
    fs      = require('fs'),
    path    = require('path');

// -- notre DB est dans fichier 'db.json'
var file = "./db.json";
var db;
try {
    db = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch(err) {
    db = {};
}
setInterval(function(){
    fs.writeFile(file, JSON.stringify(db, null, 2));
}, 25*1000);

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(multer({ dest: './public/uploads' }));

app.get('/', function(req,res){
    res.render("page",{});
});

app.get('/post', function(req,res){
    res.render("post",{});
});

app.post('/add', function(req,res){
    var filepath = req.files['fichier'].path,
        key  = filepath.split(path.sep).pop();

    db[key] = {
        nom: req.body.nom,
        url: "/uploads/"+key,
        path: filepath
    };
    res.redirect("/photos#"+key);
});

app.get('/photos', function(req,res){
        res.render("photos", {db:db});
});

app.get('/delete', function(req,res){
  var element = db[req.query.index];
  if (element){
    fs.unlink(element.path,
      function(){
        delete db[req.query.index];
      });
  };
  res.redirect("/photos");
});

app.use(express.static(__dirname + "/public"));

app.listen(3333);
