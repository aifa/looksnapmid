function onFileDataLoad() {
    $('#output-image').addClass('show').find('img').attr('src', event.target.result);
	$.post('imgsubmit', event.target.result, function(result){
	    document.open();
	    document.write(result);
	    document.close();
	}).fail(function() { 
		alert("There has been an error. Please reload and retry"); 
	});
    setTimeout(function() {
        $('#output-image').addClass('show-scanner');
    }, 1800);
    /*setTimeout(function() {
        window.location = '/product.html';
    }, 6500); */
}

var fileReader = new FileReader();

fileReader.onload = onFileDataLoad;

$(function() {
    $('#camera-input').on('change', function() {
        fileReader.onload = onFileDataLoad;
        fileReader.readAsDataURL(this.files[0]);
    });

    // $('.product').dragend();
});