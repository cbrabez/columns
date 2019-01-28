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
		evt.newIndex;  // element's new index within new parent
		console.log(itemEl.innerHTML + " dropped at position:   " + evt.newIndex);
	},
   
});