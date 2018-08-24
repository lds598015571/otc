
$.ajax({
		type: "POST",
		url: "../js/ipget.php",
		data: {},
		success: function(msg) {
			alert(JSON.stringify(msg))
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//alert(JSON.stringify(XMLHttpRequest))
			console.log(JSON.stringify(XMLHttpRequest))

		}
	});