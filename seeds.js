var mongoose = require("mongoose");
var Task = require("./models/task");

var data = [
    {
        title: "Menu für den Superbowl mit Chris und Bernd abstimmen",
        listPosition: 3
    },
    {
        title: "Save list reorder in mongodb",
        listPosition: 2
    },  
    {
        title: "Check in mit Sonja",
        listPosition: 1
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
        data.forEach(function(seed){
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
}

module.exports = seedDB;