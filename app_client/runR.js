/**
 * Created by timmimim on 04.02.17.
 */
$('#runCode').on('click', function () {
	runR();
});

function addRow() {
	$('#dataTable').append(
		'<tr>'+
			'<td><input type="text" name="outputName" placeholder="As specified in your code"/></td>' +
			'<td><input type="text" name="bands"  placeholder="Spectr. band num."></td>' +
			'<td><input type="text" name="layername" placeholder="Name of your new Layer"></td>' +
			'<td><input type="text" name="min" placeholder="Min"></td>' +
			'<td><input type="text" name="max"  placeholder="Max"></td>' +
		'</tr>'
	)
}

function runR ()
{
	var uniqueKey = document.getElementById('uniqueKey').value;

	var fName = document.getElementById('fileName').value;
	var pkg = document.getElementById('packages').value;
	var code = document.getElementById('codearea').value;

	var output = [];

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
		url: "/api/runRCode/"+ uniqueKey,
		timeout: 10000000,
		success: function(data, textStatus){
			console.log("successfully saved : " + textStatus);
			//console.log(data);
			//TODO: Trigger Data Tree Update

			alert("<bold>Berechnung von "+ fname+" abgeschlossen!</bold> \n\n Die resultierenden TMS Layer liegen im entsprechenden Projektordner bereit.");
		},
		error: function(xhr, textStatus, errorThrown){
			console.log("saving failed");
			alert("Something went wrong while running "+fname+".");
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