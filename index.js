var express = require("express");
var bodyParser = require("body-parser");
var app = express();



var todo_db = require("./seed.js");
console.log(todo_db);

app.use("/",function (req,res,next) {
    console.log("Request");
    console.log(req.url);
    console.log(req.method);
    next();
})
app.use("/",express.static(__dirname + "/public"));

app.use("/",bodyParser.urlencoded({ extended : false }));

app.get("/api/todos",function (req,res) {
    res.json(todo_db.todos);
})

app.delete("/api/todos/:id",function (req,res) {
    var del_id = req.params.id;
    var todo = todo_db.todos[del_id];

    if(!todo){
        res.status(400).json({ err : "Todo doesnot exist" });
    }

    else{
        todo.status = todo_db.StatusENUMS.DELETED;
        res.json(todo_db);
    }
})

app.post("/api/todos",function (req,res) {
    var title = req.body.title;
    console.log(title);
    if(!title || title == "" || title.trim() == ""){
        res.status(400).json({ err : "Todo Title can't be empty"});
    }

    else{
        var new_todo_object = {
            title : req.body.title,
            status : todo_db.StatusENUMS.ACTIVE
        }

        todo_db.todos[todo_db.next_todo_id++] = new_todo_object;
        res.json(todo_db.todos);
    }
})

app.put("/api/todos/:id",function (req,res) {
    var mod_id = req.params.id;
    var todo = todo_db.todos[mod_id];

    if(!todo){
        res.status(400).json( { err : "Can't modify a todo that doesnot exist"});
    }

    else{

        var todo_title = req.body.title;
        if(todo_title && todo_title!="" && todo_title.trim()!=""){
            todo.title = todo_title;
        }

        var todo_status = req.body.status;

        if(todo_status && (todo_status == todo_db.StatusENUMS.ACTIVE || todo_status == todo_db.StatusENUMS.COMPLETE)){
            todo.status = todo_status;
        }

        res.json(todo_db.todos);
    }
})

app.get("/api/todos/active",function (req,res) {
    var active_todos = {};
    for(var i=1; i < todo_db.next_todo_id; i++){
        if(todo_db.todos[i].status === todo_db.StatusENUMS.ACTIVE){
            active_todos[i] = todo_db.todos[i];
            active_todos[i].title = todo_db.todos[i].title;
            active_todos[i].status = todo_db.todos[i].status;
        }
    }
    res.json(active_todos);
})

app.get("/api/todos/complete",function (req,res) {
    var complete_todos = {};
    for(var i=1; i < todo_db.next_todo_id; i++){
        if(todo_db.todos[i].status === todo_db.StatusENUMS.COMPLETE){
            complete_todos[i] = todo_db.todos[i];
            complete_todos[i].title = todo_db.todos[i].title;
            complete_todos[i].status = todo_db.todos[i].status;
        }
    }
    res.json(complete_todos);
})

app.get("/api/todos/deleted",function (req,res) {
    var deleted_todos = {};
    for(var i=1; i < todo_db.next_todo_id; i++){
        if(todo_db.todos[i].status === todo_db.StatusENUMS.DELETED){
            deleted_todos[i] = todo_db.todos[i];
            deleted_todos[i].title = todo_db.todos[i].title;
            deleted_todos[i].status = todo_db.todos[i].status;
        }
    }
    res.json(deleted_todos);
})

app.put("/api/todos/complete/:id",function (req,res) {
    var id = req.params.id;
    var todo = todo_db.todos[id];

    if(!todo){
        res.status(400).json( { err : "Can't modify the status of a todo that doesnot exist"});
    }

    else{
        todo.status = todo_db.StatusENUMS.COMPLETE;
    }

    res.json(todo_db.todos);
})

app.put("/api/todos/active/:id",function (req,res) {
    var id = req.params.id;
    var todo = todo_db.todos[id];
    if(!todo){
        res.status(400).json( { err : "Can't modify the status of a todo that doesnot exist"});
    }

    else{
        todo.status = todo_db.StatusENUMS.ACTIVE;
    }

    res.json(todo_db.todos);
})

app.listen(4000);