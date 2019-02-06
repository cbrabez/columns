var mongoose = require("mongoose");

var taskSchema = mongoose.Schema({
   title: String,
   listPosition: Number,
   project: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },
        title: String
   }
   /*
   dueDate: Date,
   author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
   }
   */
});

module.exports = mongoose.model("Task", taskSchema);