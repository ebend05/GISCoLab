/**
 * Created by timmimim on 04.02.17.
 */
$('#saveCode').on('click', function () {
	saveR();
});

function saveR()
{

	var uniqueKey = document.getElementById('uniqueKey').value;

	var fName = document.getElementById('fileName').value;
	var code = document.getElementById('codearea').value;

	data = {
		fName: fName,
		code: code
	};

	$.ajax({
		type: "POST",
		data: data,
		url: '/api/saveRCode/'+uniqueKey,
		timeout: 5000,
		success: function(data, textStatus){
			console.log("saved R code to RScript file : " + textStatus);
			//TODO: Trigger Data Tree Update
		},
		error: function(xhr, textStatus, errorThrown){
			console.log("saving failed");
			console.log(errorThrown);
		}
	})

}