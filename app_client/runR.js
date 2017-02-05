/**
 * Created by timmimim on 04.02.17.
 */
$('#runCode').on('click', function () {
	runR();
});

function runR ()
{
	//var uniqueKey = document.getElementById('uniqueKey').value;

	var fName = document.getElementById('fileName').value;
	var pkg = document.getElementById('packages').value;
	var code = document.getElementById('codearea').value;

	var data = {
		fName: fName,
		pkg: pkg,
		code: code
	};
	console.log(data);

	$.ajax({
		type: "POST",
		data: data,
		headers: {
			Authorization: 'Bearer ' + localStorage['mean-token']
		},
		url: "/api/runRCode",
		timeout: 10000,
		success: function(data, textStatus){
			console.log("successfully saved : " + textStatus);
			//console.log(data);
			//TODO: Trigger Data Tree Update
		},
		error: function(xhr, textStatus, errorThrown){
			console.log("saving failed");
		}
	})
}

$('#lameTest').on('click', function () {
	runExistingScript();
});

function runExistingScript() {
	var uniqueKey = document.getElementById('uniqueKey').value;
	$.ajax({
		type: "POST",
		url: '/api/runExistingCode/' + uniqueKey,
		timeout: 100000,
		success: function () {
			console.log("yay");
		},
		error: function () {
			console.log("dangit! :(");
		}
	})
}