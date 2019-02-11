Sortable.create(taskList, { 
     group: {
        name: 'shared',
        pull: 'clone'
      },
    animation: 150,
    
    onEnd: function (/**Event*/evt) {
		var itemEl = evt.item;  // dragged HTMLElement
		evt.to;    // target list
		evt.from;  // previous list
		evt.oldIndex;  // element's old index within old parent
		var listPosition = evt.newIndex;  // element's new index within new parent
		var name = itemEl.innerHTML;
		$.ajax({
            method: "POST",
            url: "/tasks/" + taskId + "/?_method=PUT",
            data: {name: name, listPosition: listPosition},
            success: function(result) {
            }
        });
	},
});