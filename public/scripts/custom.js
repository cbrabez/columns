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
   
   // delete task on button click
   $(".delete-task").on('click', function(){
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
