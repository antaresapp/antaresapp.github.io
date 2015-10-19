setSettings();

function setSettings(){
	var categories = store.get('categories');
	for(var x in categories){
	  var cat = categories[x];
	  var route = cat['route'];
	  var enabled = cat['enabled'];
	  
	  if(cat.hasOwnProperty('sources')){
	  	var sources = cat['sources'];
	    for(var y in sources){
	      var source_route = sources[y]['route'];
	      var source_enabled = sources[y]['enabled'];
	      if(source_enabled){
	        $("input[name=" + source_route + "]").prop('checked', true);
	      }else{
	        $("input[name=" + source_route + "]").prop('checked', false);
	      }
	    }
	  }
	  if(enabled){
	    $("input[name=" + route + "]").prop('checked', true);
	  }else{
	    $("input[name=" + route + "]").prop('checked', false);
	  }
	 
	}
}

function setCategories(){

	var categories = [];
	$('.category').each(function(){
		var category = $(this);
		var name = category.data('name');
		var route = category.attr('name');
		
		var enabled = false;
		if(category.is(':checked')){
			enabled = true;
		}

		var sources = [];
		category.parents('li:eq(0)').find('.sources input').each(function(){
			var self = $(this);
			var source_name = self.data('name');
			var source_route = self.attr('name');
			var source_enabled = false;
			if(self.is(':checked')){
				source_enabled = true;
			}

			sources.push({
				'name': source_name,
				'route': source_route,
				'enabled': source_enabled
			});
			
		});

		categories.push({
			'name': name,
			'route': route,
			'enabled': enabled,
			'sources': sources
		});
		
	});

	store.set('categories', categories);
}

$('.category').click(function(){

	setCategories();

});

$('.source').click(function(){

	setCategories();

});