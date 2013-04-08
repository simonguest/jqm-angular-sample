var express = require('express')
    , http = require('http')
    , path = require('path')
    , mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'todo');
var todoSchema = mongoose.Schema({description:'String', body:'String', project:'String', context:'String', duedate:'String'});
var todoModel = db.model('Task', todoSchema);
var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use('/public',express.static(path.join(__dirname,'/public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', function(req,res){
    res.sendfile('index.html');
});

/* list todo items */
app.get('/api/todo', function (req, res) {
    return todoModel.find(function (err, todos) {
        if (!err) {
            return res.send(todos);
        }
        else {
            return console.log(err);
        }
    });
});

/* list by id*/
app.get('/api/todo/:id', function (req, res) {
    return todoModel.findById(req.params.id, function (err, todo) {
        if (!err) {
            return res.send(todo);
        }
        else {
            return console.log(err);
        }
    });
});

/* create */
app.post('/api/todo', function (req, res){
    console.log(req.body);
    todo = new todoModel({
        description: req.body.description,
        body: req.body.body,
        project: req.body.project,
        context: req.body.context,
        duedate: req.body.duedate
    });
    todo.save(function (err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });
    return res.send(todo);
});

/* update */
app.put('/api/todo/:id', function (req, res){
    return todoModel.findById(req.params.id, function (err, todo) {
        console.log(req.body);
        todo.description = req.body.description;
        todo.body = req.body.body;
        todo.project = req.body.project;
        todo.context = req.body.context;
        todo.duedate = req.body.duedate;
        return todo.save(function (err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.send(todo);
        });
    });
});

/* delete */
app.delete('/api/todo/:id', function (req, res){
    return todoModel.findById(req.params.id, function (err, todo) {
        return todo.remove(function (err) {
            if (!err) {
                console.log("removed");
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});