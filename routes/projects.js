var express = require("express");
var router = express.Router();
var Task = require("../models/task");
var Project = require("../models/project");
var middleware = require("../middleware");

// INDEX - show all tasks
router.get("/:id", middleware.isLoggedIn, function(req, res){
    // Get all tasks from DB
    Task.find({}).sort({listPosition: 'ascending'}).exec(function(err, allTasks) {
        if(err){
            console.log(err);
        } else {
           Project.find({_id: { $ne: "5c9ce5f10e60f30aea6e3caf" }}).exec(function(err, allProjects) {
              if(err){
               console.log(err);     
              } else {
                     Project.find({_id: req.params.id}).exec(function(err, project) {
                         if(err){
                             console.log(err);        
                         } else {
                             Task.find({$and:[{'project.id': req.params.id}, {'completed': {$ne: true}}]}).sort({listPosition: 'ascending'}).exec(function(err, tasksToProject){
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

// UPDATE - update one task and task position
router.put("/:id", middleware.isLoggedIn, function(req, res){
    var title = (req.body.title).split("<")[0];
    var updateProject = {title: title,};
    // find and update correct task
    Project.findByIdAndUpdate(req.params.id, updateProject, function(err, updatedProject){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/projects");
        }              
    });
});


// CREATE - add new project to DB
router.post("/", middleware.isLoggedIn, function(req, res){
   var title = req.body.title;
   //var content = req.body.content;
   /*var author = {
       id: req.user._id,
       username: req.user.username
   };
   */
   var newProject = {title: title};
   Project.create(newProject, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          
      }
   });
});

module.exports = router;