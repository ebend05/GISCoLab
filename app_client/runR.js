/**
 * Created by timmimim on 04.02.17.
 */
$('#runCode').on('click', function () {
	runR();
});

function runR ()
{
	var uniqueKey = document.getElementById('uniqueKey').value;

	var fName = document.getElementById('fileName').value;
	var pkg = document.getElementById('packages').value;
	var code = document.getElementById('codearea').value;

	data = {
		fName: fName,
		pkg: pkg,
		code: code
	};

	$.ajax({
		type: "GET",
		data: data,
		url: '/api/runRCode',
		timeout: 5000,
		success: function(data, textStatus){
			console.log("successfully saved : " + textStatus);
			console.log(data);
			//TODO: Trigger Data Tree Update
		},
		error: function(xhr, textStatus, errorThrown){
			console.log("saving failed");
		}
	})
}