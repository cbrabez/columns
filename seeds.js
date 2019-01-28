var mongoose = require("mongoose");
var Task = require("./models/task");

var data = [
    {
        title: "Menu für den Superbowl mit Chris und Bernd abstimmen"
    },
    {
        title: "Save list reorder in mongodb"
    },
    {
        title: "Check in mit Sonja"
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