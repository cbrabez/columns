var express = require("express");
var router = express.Router();
var Task = require("../models/task");
var middleware = require("../middleware");

/*
// task index
router.get("/", function(req, res){
   res.render("tasks"); 
});
*/

// INDEX - show all tasks
router.get("/", function(req, res){
    // Get all tasks from DB
    Task.find({}).sort({date: 'descending'}).exec(function(err, allTasks) {
        if(err){
            console.log(err);
        } else {
           res.render("tasks", {tasks: allTasks});    
                }
            });
});

// UPDATE - update one task
// UPDATE Task ROUTE
router.put("/:id", function(req, res){
    console.log("YOU HIT THE UPDATE ROUTE");
    var name = req.body.name;
    var listPosition = req.body.listPosition;
    
   var newTask = {name: name, listPosition: listPosition};
   
    // find and update correct task
    Task.findByIdAndUpdate(req.params.id, newTask, function(err, updatedTask){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/tasks");
            console.log(updatedTask);
        }
    });
});


module.exports = router;