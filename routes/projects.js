var express = require("express");
var router = express.Router();
var Task = require("../models/task");
var Project = require("../models/project");
var middleware = require("../middleware");

// INDEX - show all tasks
router.get("/:id", function(req, res){
    // Get all tasks from DB
    Task.find({}).sort({listPosition: 'ascending'}).exec(function(err, allTasks) {
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
                             Task.find({'project.id': req.params.id}).sort({listPosition: 'ascending'}).exec(function(err, tasksToProject){
                                    if(err){
                                        console.log(err);        
                                    } else {
                                        res.render("project/projects", {tasksToProject: tasksToProject, projects: allProjects, project: project});        
                                    }
                                });
                         }
                     });
              }
           });
        }
    });
});

module.exports = router;