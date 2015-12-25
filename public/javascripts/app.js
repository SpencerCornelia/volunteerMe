$(function() {
	$.getJSON("/currentUser", function (data) {
		$("#firstNameData").text(data.firstName);
		$("#lastNameData").text(data.lastName);
		$("#locationData").text(data.location);
	});


});