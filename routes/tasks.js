var express = require("express");
var moment = require("moment");
var router = express.Router();
var Task = require("../models/task");
var Project = require("../models/project");
var middleware = require("../middleware");


function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getShortDate(date){
    var month = ("0" + (date.getMonth() + 1)).slice(-2); //months from 1-12 
    var day = date.getUTCDate() - 1;
    var year = date.getUTCFullYear();
    var newdate = year + "-" + month + "-" + day + "T23:00:00.000Z";
    return newdate;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


//var monday = getMonday(new Date())



// INDEX - show all tasks
router.get("/", middleware.ensureAuthenticated, function(req, res){
    // Get all tasks from DB
    Task.find({'project.id': "5c9ce5f10e60f30aea6e3caf" }).sort({listPosition: 'ascending'}).exec(function(err, allTasks) {
        if(err){
            console.log(err);
        } else {
            Project.find({_id: { $ne: "5c9ce5f10e60f30aea6e3caf" }}).exec(function(err, allProjects) {
                if(err){
                    console.log(err);        
                } else {
                    res.render("tasks/tasks", {tasks: allTasks, projects: allProjects});        
                }
            });
           
        }
    });
});


// weekly view
router.get("/weeklyplan", middleware.isLoggedIn, function(req, res){
     // Get all tasks from DB
    Task.find({'dueDate': ""}).sort({listPosition: 'ascending'}).exec(function(err, tasksNotScheduled) {
        if(err){
            console.log(err);
        } else {
           Project.find({}).exec(function(err, allProjects) {
              if(err){
               console.log(err);     
              } else {
                     Project.find({_id: req.params.id}).exec(function(err, project) {
                         if(err){
                             console.log(err);        
                         } else {
                             Task.find({'dueDate': getShortDate(getMonday(new Date()))}).sort({listPosition: 'ascending'}).exec(function(err, tasksMonday){
                                    if(err){
                                        console.log(err);        
                                    } else {
                                        Task.find({'dueDate': getShortDate(addDays(getMonday(new Date()), 1))}).sort({listPosition: 'ascending'}).exec(function(err, tasksTuesday){
                                            if(err){
                                                console.log(err);        
                                            } else {
                                                Task.find({'dueDay': getShortDate(addDays(getMonday(new Date()), 2))}).sort({listPosition: 'ascending'}).exec(function(err, tasksWednesday){
                                                    if(err){
                                                        console.log(err);        
                                                    } else {
                                                        Task.find({'dueDay': getShortDate(addDays(getMonday(new Date()), 3))}).sort({listPosition: 'ascending'}).exec(function(err, tasksThursday){
                                                            if(err){
                                                                console.log(err);        
                                                            } else {
                                                                Task.find({'dueDay': getShortDate(addDays(getMonday(new Date()), 4))}).sort({listPosition: 'ascending'}).exec(function(err, tasksFriday){
                                                                    if(err){
                                                                        console.log(err);        
                                                                    } else {
                                                                        res.render("tasks/weeklyplan", {tasksMonday: tasksMonday,tasksTuesday: tasksTuesday, tasksWednesday: tasksWednesday, tasksThursday: tasksThursday, tasksFriday: tasksFriday,tasksNotScheduled:                       tasksNotScheduled, projects: allProjects, project: project});           }
                                                                    });
                                                                }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                         }
                     });
              }
           });
        }
    });
});


// Update date



// UPDATE - update one task and task position
router.put("/:id", middleware.isLoggedIn, function(req, res){
    //var title = (req.body.title).split("<")[0];
    //var listPosition = req.body.listPosition;
    var dueDate = req.body.dueDate;
    var completed = req.body.completed;
   // var newTaskOldPosition = req.body.oldPosition;
    
   var newTask = {/*title: title,*/ dueDate: dueDate, completed: completed /*listPosition: listPosition*/};
    // find and update correct task
    Task.findByIdAndUpdate(req.params.id, newTask, function(err, updatedTask){
        if(err){
            res.redirect("/");
        } else {
           /*Task.find({_id: { $ne: req.params.id } }, function(err, tasksToUpdate){
                if(err){
                    res.redirect("/");
                } else {
                    
                    tasksToUpdate.forEach(function(task){
                        if(task.listPosition < newTaskOldPosition && task.listPosition >= newTask.listPosition){
                            task.listPosition = task.listPosition + 1;
                            console.log("ID looking to match is:        " + req.params.id);
                            console.log("Update for ID: " + task.id + "@ position   " + task.listPosition);
                            task.save();
                            
                        } else if(task.listPosition > newTaskOldPosition && task.listPosition <= newTask.listPosition){
                            task.listPosition = task.listPosition - 1;
                            console.log("ID looking to match is:        " + req.params.id);
                            console.log("Update for ID: " + task.id + "@ position   " + task.listPosition);
                            task.save();
                            }
                            else {
                            return;
                            }
                        
                    });
                    res.redirect("/tasks");
                }
            });*/
            console.log(updatedTask);
            res.redirect("/tasks");
        }              
    });
});

// CREATE - add new task to DB
router.post("/", middleware.isLoggedIn, function(req, res){
   Task.count({}, function(err, taskCount) {
        if(err){
            console.log(err);
        } else{
            var listPosition = taskCount+1;
            var title = req.body.title;
            var dueDay = "someday";
            var projectId = req.body.projectId;
            var newTask = {title: title, listPosition: listPosition, dueDay: dueDay, project: {id: projectId}};
            Task.create(newTask, function(err, newlyCreated){
               if(err){
                   console.log(err);
               } else {
                   res.redirect("/tasks");
               }
            });
        }
    });
});

// DESTROY TASK ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res){
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