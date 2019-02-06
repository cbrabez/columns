var mongoose = require("mongoose");
var Task = require("./models/task");
var Project = require("./models/project");

var tasks = [
    {
        title: "Menu für den Superbowl mit Chris und Bernd abstimmen",
        listPosition: 3,
        project: {
        id: "5c57fc3401bd7c0996da7656",
        title: "Programming",
        },
    },
    {
        title: "Save list reorder in mongodb",
        listPosition: 2,
        project: {
        id: "5c57fc3401bd7c0996da7657",
        title: "Sparda-Consult",
        },
    },  
    {
        title: "Check in mit Sonja",
        listPosition: 1,
        project: {
        id: "5c57fc3401bd7c0996da7658",
        title: "Check in mit Sonja",
        },
    }
];

var projects = [
    {
        title: "Programming"
    },
    {
        title: "Sparda-Consult"
    },  
    {
        title: "Rund ums Haus"
    }
];

function seedDB(){
    // Remove all campgrounds
    Task.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed tasks!")
        
        // add a few campgrounds
        tasks.forEach(function(seed){
            Task.create(seed, function(err, task){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a task");
                    task.save();
                }
                        
            });  
        });
    });  
    Project.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed projects!")
        
        // add a few campgrounds
        projects.forEach(function(seed){
            Project.create(seed, function(err, project){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a project");
                    project.save();
                }
                        
            });  
        });
    });  
}

module.exports = seedDB;