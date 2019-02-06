var mongoose = require("mongoose");

var projectSchema = mongoose.Schema({
   title: String,
    //content: String,
   /*author: {
         id: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User"
         },
         username: String
    }
   */
 });

module.exports = mongoose.model("Project", projectSchema);