var items_template = Handlebars.compile($('#items-template').html());
var categories_template = Handlebars.compile($('#categories-template').html());
var categories_mobile_template = Handlebars.compile($('#categories-mobile-template').html());

var path = window.location.pathname;
if(path == '/'){
	path = '/hn';
}
$('a[href="' + path + '"]').addClass('active');

$('#items').on('click', '.item-link', function(){
	$(this).siblings('.actions').children('a').removeClass('hidden');
});

$('#news_sources').change(function(){
	var value = $(this).val();
	window.location.href = value;
});

var categories = store.get('categories');

var category = 'hn';
var path_array = window.location.pathname.split('/');
if(path_array[1] != ''){
	category = path_array[1];
}

$("a[href='/" + category + "']").addClass('active');
$("option[value='/" + category + "']").prop('selected', true);

var current_category = _.find(categories, function(cat) {
  return cat.route == category;
});

var enabled_sources = _.filter(current_category.sources, function(src){
  return src.enabled;
});

var enabled_categories = _.filter(categories, function(cat){
	return cat.enabled;
});

var categories_html = categories_template({'categories': enabled_categories});
$('#nav ul').html(categories_html);

var categories_mobile_html = categories_mobile_template({'categories': enabled_categories});
$('#mobile-nav ul').html(categories_mobile_html);

var requests = [];

var base_url = 'http://antaresapp.space/json/';


if(enabled_sources.length > 0){
	for(var x in current_category.sources){

		var source = current_category.sources[x];
		if(source.enabled){		

			requests.push(
				$.getJSON(base_url + source.route + '.json')
			);
		}
	}
}else{	
	requests.push(
		$.getJSON(base_url + current_category.route + '.json')
	);
}


$.when.apply($, requests).then(function(){
	args = arguments;
	var news_items = [];
	
	if(enabled_sources.length > 1){
		for(var x in arguments){
			if(arguments[x] instanceof Array){		
				var items = arguments[x][0];
				
				for(var y in items){
					var item = items[y];
					news_items.push(item);
				}
			}
		}
	}else if(enabled_sources.length <= 1){
		
		var items = arguments[0];
		for(var y in items){
			var item = items[y];
			news_items.push(item);
		}
	}

	var items_html = items_template({'items': news_items});
	$('#items').html(items_html).removeClass('hidden');

});

	
