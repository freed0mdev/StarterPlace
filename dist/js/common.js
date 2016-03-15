$(function() {

	//Chrome Smooth Scroll
	try {
		$.browserSelector();
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {

	};

	//Slider
	$('.slider').bxSlider({
		adaptiveHeight: true,
		pager: false
	});

	//AjaxSearch
	$("#search").keyup(function(){
		var search = $("#search").val();
		$.ajax({
			type: "POST",
			url: "search.php",
			data: {"search": search},
			cache: false,                                 
			success: function(response){
				$("#results").html(response);
			}
		});
		return false;
	});
	$("#search").focusout(function(){
		$("#results").empty();
	});

});

