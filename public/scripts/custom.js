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

	//on resize, move search and top nav position according to window width
	var resizing = false;
	moveNavigation();
	$(window).on('resize', function(){
		if( !resizing ) {
			(!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
			resizing = true;
		}
	});

	//on window scrolling - fix sidebar nav
	var scrolling = false;
	checkScrollbarPosition();
	$(window).on('scroll', function(){
		if( !scrolling ) {
			(!window.requestAnimationFrame) ? setTimeout(checkScrollbarPosition, 300) : window.requestAnimationFrame(checkScrollbarPosition);
			scrolling = true;
		}
	});

	//mobile only - open sidebar when user clicks the hamburger menu
	sidebarTrigger.on('click', function(event){
		event.preventDefault();
		$([sidebar, sidebarTrigger]).toggleClass('nav-is-visible');
	});

	//click on item and show submenu
	$('.has-children > a').on('click', function(event){
		var mq = checkMQ(),
			selectedItem = $(this);
		if( mq == 'mobile' || mq == 'tablet' ) {
			event.preventDefault();
			if( selectedItem.parent('li').hasClass('selected')) {
				selectedItem.parent('li').removeClass('selected');
			} else {
				sidebar.find('.has-children.selected').removeClass('selected');
				accountInfo.removeClass('selected');
				selectedItem.parent('li').addClass('selected');
			}
		}
	});

	//click on account and show submenu - desktop version only
	accountInfo.children('a').on('click', function(event){
		var mq = checkMQ(),
			selectedItem = $(this);
		if( mq == 'desktop') {
			event.preventDefault();
			accountInfo.toggleClass('selected');
			sidebar.find('.has-children.selected').removeClass('selected');
		}
	});

	$(document).on('click', function(event){
		if( !$(event.target).is('.has-children a') ) {
			sidebar.find('.has-children.selected').removeClass('selected');
			accountInfo.removeClass('selected');
		}
	});

	//on desktop - differentiate between a user trying to hover over a dropdown item vs trying to navigate into a submenu's contents
	sidebar.children('ul').menuAim({
        activate: function(row) {
        	$(row).addClass('hover');
        },
        deactivate: function(row) {
        	$(row).removeClass('hover');
        },
        exitMenu: function() {
        	sidebar.find('.hover').removeClass('hover');
        	return true;
        },
        submenuSelector: ".has-children",
    });

	function checkMQ() {
		//check if mobile or desktop device
		return window.getComputedStyle(document.querySelector('.cd-main-content'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}

	function moveNavigation(){
  		var mq = checkMQ();
        
        if ( mq == 'mobile' && topNavigation.parents('.cd-side-nav').length == 0 ) {
        	detachElements();
			topNavigation.appendTo(sidebar);
			searchForm.removeClass('is-hidden').prependTo(sidebar);
		} else if ( ( mq == 'tablet' || mq == 'desktop') &&  topNavigation.parents('.cd-side-nav').length > 0 ) {
			detachElements();
			searchForm.insertAfter(header.find('.cd-logo'));
			topNavigation.appendTo(header.find('.cd-nav'));
		}
		checkSelected(mq);
		resizing = false;
	}

	function detachElements() {
		topNavigation.detach();
		searchForm.detach();
	}

	function checkSelected(mq) {
		//on desktop, remove selected class from items selected on mobile/tablet version
		if( mq == 'desktop' ) $('.has-children.selected').removeClass('selected');
	}

	function checkScrollbarPosition() {
		var mq = checkMQ();
		
		if( mq != 'mobile' ) {
			var sidebarHeight = sidebar.outerHeight(),
				windowHeight = $(window).height(),
				mainContentHeight = mainContent.outerHeight(),
				scrollTop = $(window).scrollTop();

			( ( scrollTop + windowHeight > sidebarHeight ) && ( mainContentHeight - sidebarHeight != 0 ) ) ? sidebar.addClass('is-fixed').css('bottom', 0) : sidebar.removeClass('is-fixed').attr('style', '');
		}
		scrolling = false;
	}
   
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
           console.log("SUCCESS ADD");
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
           console.log("SUCCESS UPDATE");
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
                console.log("SUCCESS COMPLETED");
                location.reload(true);
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
             console.log("SUCCESS DELETE");
             location.reload(true);
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
        console.log("SUCCESS ADDING PROJECT");
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
           console.log("SUCCESS UPDATE");
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




