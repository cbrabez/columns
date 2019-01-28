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
    Task.find({}, function(err, allTasks){
        if(err){
            console.log(err);
        } else {
           res.render("tasks", {tasks: allTasks});    
                }
            });
});


module.exports = router;