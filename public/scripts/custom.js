$(function(){
   // delete tasks on checkbox change
   $(".checkbox").on('change', function(){
         var taskId = $(this).parent().attr('data-id');
         $.ajax({
            method: "POST",
            url: "/tasks/" + taskId + "/?_method=DELETE",
            data: {id: taskId},
            success: function(result) {
                console.log("SUCCESS DELETE");
                location.reload(true);
            }
         });
   });
   
});

function addTask(task){
    var new_task = task;
      $.ajax({
         method: "POST",
         url: "/tasks",
         data: {title: new_task},
         success: function(result) {
           console.log("SUCCESS ADD");
           location.reload(true);
         }
      });
};

deleteTask = function(id){
   var taskId = id;
      $.ajax({
         method: "POST",
         url: "/tasks/" + taskId + "/?_method=DELETE",
         data: {id: taskId},
         success: function(result) {
             console.log("SUCCESS DELETE");
             location.reload(true);
         }
      });
}


// add task with Enter-Key in input field
$(".task-entry").on('keypress',function(e) {
    var task = $('.task-input').val();
    if(e.which == 13) {
          addTask(task);
    }
});
// add task with click on "Add" button
$('button').click(function(e) {
   var task = $('.task-input').val();
   addTask(task);
 });
 
// delete task on button click
   $(".delete-task").on('click', function(e){
      var id = $(this).parent().attr('data-id');
      deleteTask(id);
   });

// make task list sortable and save position of list-item in db
$("ul#taskList").sortable({
    pull: 'clone',
    animation: 150,
     onEnd: function (/**Event*/evt) {
		var itemEl = evt.item;  // dragged HTMLElement
		evt.to;    // target list
		evt.from;  // previous list
		evt.oldIndex;  // element's old index within old parent
		var listPosition = evt.newIndex+1;  // element's new index within new parent
		var title = itemEl.innerHTML;
		var taskId = itemEl.getAttribute("data-id");
		$.ajax({
            method: "POST",
            url: "/tasks/" + taskId + "/?_method=PUT",
            data: {title: title, listPosition: listPosition},
            success: function(result) {
            }
        });
	},
});