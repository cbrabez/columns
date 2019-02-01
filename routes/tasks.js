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
    Task.find({}).sort({listPosition: 'ascending'}).exec(function(err, allTasks) {
        if(err){
            console.log(err);
        } else {
           res.render("tasks/tasks", {tasks: allTasks});    
                }
            });
});

// UPDATE - update one task and task position
router.put("/:id", function(req, res){
    console.log("YOU HIT THE UPDATE ROUTE");
    var title = (req.body.title).split("<")[0];
    var listPosition = req.body.listPosition;
    
   var newTask = {title: title, listPosition: listPosition};
   console.log("The updated task is: " + newTask.title + " " + newTask.listPosition);
    // find and update correct task
    Task.findByIdAndUpdate(req.params.id, newTask, function(err, updatedTask){
        if(err){
            res.redirect("/");
        } else {
            Task.find({_id: { $ne: req.params.id } }, function(err, tasksToUpdate){
                if(err){
                    res.redirect("/");
                } else {
                    
                    tasksToUpdate.forEach(function(task){
                        if(task.listPosition < newTask.listPosition){
                            return;
                        } else {
                            task.listPosition = task.listPosition + 1;
                            console.log("ID looking to match is:        " + req.params.id);
                            console.log("Update for ID: " + task.id + "@ position   " + task.listPosition);
                            task.save();
                        }
                    });
                    res.redirect("/tasks");
                }
            });
        }              
    });
});

// CREATE - add new task to DB
router.post("/", function(req, res){
   Task.count({}, function(err, taskCount) {
        if(err){
            console.log(err);
        } else{
            var listPosition = taskCount+1;
            var title = req.body.title;
            var newTask = {title: title, listPosition: listPosition};
            Task.create(newTask, function(err, newlyCreated){
               if(err){
                   console.log(err);
               } else {
                   console.log(newlyCreated);
                   res.redirect("/tasks");
               }
            });
        }
    });
});

// DESTROY TASK ROUTE
router.delete("/:id", function(req, res){
    Task.findByIdAndRemove(req.params.id, function(err, deletedTask){
        console.log("Trying to delete" + req.params.id);
        if(err){
            res.redirect("/tasks");
        } else {
            Task.find({_id: { $ne: req.params.id } }, function(err, tasksToUpdate){
                if(err){
                    res.redirect("/");
                } else {
                    
                    tasksToUpdate.forEach(function(task){
                        if(task.listPosition < deletedTask.listPosition){
                            return;
                        } else {
                            task.listPosition = task.listPosition - 1;
                            console.log("ID looking to match is:        " + req.params.id);
                            console.log("Update for ID: " + task.id + "@ position   " + task.listPosition);
                            task.save();
                        }
                    });
                    res.redirect("/tasks");
                }
            });
        }
    });
});

module.exports = router;