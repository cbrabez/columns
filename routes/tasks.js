var express = require("express");
var router = express.Router();
var Task = require("../models/task");
var middleware = require("../middleware");


// task index
router.get("/", function(req, res){
   res.render("tasks"); 
});


module.exports = router;