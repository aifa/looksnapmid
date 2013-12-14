var NUMBER_OF_FILENAME_PARTS_IN_CAPS = 6;
var NUMBER_OF_FILENAME_PARTS_IN_NAPS = 8;
var NUMBER_OF_FILENAME_PARTS_IN_CAPSNAPS = 10;

var WHITESPACE = /^.*\s.*$/;
var EXTENSION = ".zip";
var DELIMETER = "_";

var BASIC_FORMAT_UPPER_CASE_HUNDRED_CHARS = /^[A-Z0-9-]{1,100}$/;
var BASIC_FORMAT_UPPER_CASE = /^[A-Z0-9-]+$/;
var BASIC_FORMAT_UPPER_LOWER_CASE = /^[A-Za-z0-9-]+$/;
var BASIC_FORMAT_UPPER_LOWER_CASE_THIRTY_CHARS = /^[A-Za-z0-9-]{1,30}$/;
var PSUR_TYPE = /^psusa$/;

var SEQUENCE_NUMBER_REG_EXP = /^[0-9][0-9]{3}$/;
var SIX_DIGIT_DATE = /^\d{6}$/;
var EURDID_REG_EXP = /^[0-9]{8}$/;
var PRODUCT_NUMBER = /^[A-Z]*[0-9]{6}$/;

function valObject(regexp, fieldName) {
	this.regexp = regexp;
	this.fieldName = fieldName;
}

var capsFormat = [
		new valObject(BASIC_FORMAT_UPPER_CASE_HUNDRED_CHARS, "Sender Id"),
		new valObject(BASIC_FORMAT_UPPER_CASE_HUNDRED_CHARS, "Receiver Id"),
		new valObject(PRODUCT_NUMBER, "Product Number"),
		new valObject(BASIC_FORMAT_UPPER_LOWER_CASE_THIRTY_CHARS,
				"Product Name"),
		new valObject(BASIC_FORMAT_UPPER_LOWER_CASE, "Submission Type"),
		new valObject(SEQUENCE_NUMBER_REG_EXP, "Sequence Number") ];

var napsFormat = [
		new valObject(BASIC_FORMAT_UPPER_CASE_HUNDRED_CHARS, "Sender Id"),
		new valObject(BASIC_FORMAT_UPPER_CASE_HUNDRED_CHARS, "Receiver Id"),
		new valObject(EURDID_REG_EXP, "Eurd number"),
		new valObject(BASIC_FORMAT_UPPER_LOWER_CASE_THIRTY_CHARS,
				"Substance name"),
		new valObject(BASIC_FORMAT_UPPER_LOWER_CASE, "MAH name"),
		new valObject(SIX_DIGIT_DATE, "Eurd Date"),
		new valObject(PSUR_TYPE, "Submission Type"),
		new valObject(SEQUENCE_NUMBER_REG_EXP, "Sequence Number") ];

var capsnapsFormat = [
		new valObject(BASIC_FORMAT_UPPER_CASE_HUNDRED_CHARS, "Sender Id"),
		new valObject(BASIC_FORMAT_UPPER_CASE_HUNDRED_CHARS, "Receiver Id"),
		new valObject(PRODUCT_NUMBER, "Product Number"),
		new valObject(BASIC_FORMAT_UPPER_LOWER_CASE_THIRTY_CHARS,
				"Product Name"),
		new valObject(EURDID_REG_EXP, "Eurd number"),
		new valObject(BASIC_FORMAT_UPPER_LOWER_CASE_THIRTY_CHARS,
				"Substance name"),
		new valObject(BASIC_FORMAT_UPPER_LOWER_CASE, "MAH name"),
		new valObject(SIX_DIGIT_DATE, "Eurd Date"),
		new valObject(PSUR_TYPE, "Submission Type"),
		new valObject(SEQUENCE_NUMBER_REG_EXP, "Sequence Number") ];

var composeName = function(type, data) {
	var filename = "";
	switch (type) {
	case "caps":
		filename = data.inputSender + '_' + data.receipient + '_'
				+ data.inputPNumber + '_' + data.inputPName + '_'
				+ data.inputSubType + '_' + data.inputSeqnumber;
		break;
	case "caps_naps":
		filename = data.inputSender + '_' + data.receipient + '_'
				+ data.inputPNumber + '_' + data.inputPName + '_'
				+ data.inputEurd + '_' + data.inputSub + '_' + data.inputMAH
				+ '_' + data.inputEurDate + '_' + data.inputSubType + '_'
				+ data.inputSeqNumber;
		break;
	case "naps":
		filename = data.inputSender + '_' + data.receipient + '_'
				+ data.inputEurd + '_' + data.inputSub + '_' + data.inputMAH
				+ '_' + data.inputEurDate + '_' + data.inputSubType + '_'
				+ data.inputSeqNumber;
		break;
	default:
		return 'Unrecognised submission type';
		break;
	}
	filename += EXTENSION;

	return validateFileName(filename);
};

/**
 * Validate filename and return an error message or the filename if it is valid.
 */
var validateFileName = function(filename) {
	var result = "<ol>";
	// check null or empty
	if (filename == null || filename == '') {
		result += '<li class=\'text-error\'>No filename given' + '</ul>';
		return result;
	}
	// check max length
	if (filename.length > 255) {
		result += '<li class=\'text-error\'>' + filename + ' exceeds 255 characters' + '</ul>'; 
		return result;
	}

	if (WHITESPACE.test(filename)) {
		result += '<li class=\'text-error\'>' + filename + " should not contain any whitespace" + '</ul>';
		return result;
	}

	// check for whitespace
	if (endsWith(filename, EXTENSION) == false) {
		result += '<li class=\'text-error\'>'+ filename + ": Should end in " + EXTENSION + '</ul>';
		return result;
	}

	var filenameParts = filename.replace(EXTENSION, "").split("_");
	var regExpArray = null;

	switch (filenameParts.length) {
	case NUMBER_OF_FILENAME_PARTS_IN_CAPS:
		regExpArray = capsFormat;
		break;
	case NUMBER_OF_FILENAME_PARTS_IN_NAPS:
		regExpArray = napsFormat;
		break;
	case NUMBER_OF_FILENAME_PARTS_IN_CAPSNAPS:
		regExpArray = capsnapsFormat;
		break;
	default:
		result += '<li class=\'text-error\'>Wrong number of filename parts...Unrecognised submission type </ul>';
		return  result;
	}

	if (regExpArray == null) {
		result += "<li class='text-error'>Oops...Internal System error </ul>";
		return result;
	}

	var foundError = false;

	for ( var i = 0; i < filenameParts.length; i++) {
		if (!regExpArray[i].regexp.test(filenameParts[i])) {
			result += "<li class='text-error'>" + regExpArray[i].fieldName + " has an invalid format</li>";
			if (foundError == false) {
				foundError = true;
			}
		}
	}

	if (foundError == false) {
		result += "<li class='text-success'>" + filename + "</li>";
	}

	result += "</ol>";
	return result;
};

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

exports.composeName = composeName;
exports.validateFileName = validateFileName;