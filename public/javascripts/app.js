$(function() {
	$.getJSON("/currentUser", function (data) {
		$("#data").text(data.firstName);
	});


});