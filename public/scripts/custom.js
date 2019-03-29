$(function(){
   // Responsive Navigation


	//cache DOM elements
	var mainContent = $('.cd-main-content'),
		header = $('.cd-main-header'),
		sidebar = $('.cd-side-nav'),
		sidebarTrigger = $('.cd-nav-trigger'),
		topNavigation = $('.cd-top-nav'),
		searchForm = $('.cd-search'),
		accountInfo = $('.account');

	//mobile only - open sidebar when user clicks the hamburger menu
	sidebarTrigger.on('click', function(event){
		event.preventDefault();
		$([sidebar, sidebarTrigger]).toggleClass('nav-is-visible');
	});


   
});

/*		ENDE SORTED.JS		*/

function addTask(task, projectId){
    var new_task = task;
    var projectId = projectId;
    console.log(projectId)
      $.ajax({
         method: "POST",
         url: "/tasks",
         data: {title: new_task, projectId: projectId},
         success: function(result) {
           location.reload(true);
         }
      });
}
function updateTask(id, date){
	var taskId = id;
	var dueDate = date;
      $.ajax({
         method: "POST",
         url: "/tasks/" + taskId + "/?_method=PUT",
         data: {id: taskId, dueDate: dueDate},
         success: function(result) {
           location.reload(true);
         }
      });	
}

function completeTask(id){
    console.log("TASK COMPLETED	" + taskId);
    var taskId = id;
         $.ajax({
            method: "POST",
            url: "/tasks/" + taskId + "/?_method=PUT",
            data: {id: taskId, completed: true},
            success: function(result) {
            }
         });
}


deleteTask = function(id){
   var taskId = id;
      $.ajax({
         method: "POST",
         url: "/tasks/" + taskId + "/?_method=DELETE",
         data: {id: taskId},
         success: function(result) {
         }
      });
}

function addProject(project){
   var new_project = project;
   console.log("Trying ajax post for project:	" + new_project);
   $.ajax({
      method: "POST",
      url: "/projects",
      data: {title: new_project},
      success: function(result) {
        location.reload(true);
      }
   });
}

function updateProject(id, title){
	var projectId = id;
	var title = title;
      $.ajax({
         method: "POST",
         url: "/projects/" + projectId + "/?_method=PUT",
         data: {id: projectId, title: title},
         success: function(result) {
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
//add task with click on "Add" button
$('button').click(function(e) {
   var task = $('.task-input').val();
   addTask(task);
 });

// delete task on button click
   $(".delete-task").on('click', function(e){
      var id = $(this).parent().attr('data-id');
      deleteTask(id);
   });
 
