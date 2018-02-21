
/*
 * @param {String}
 * @return {String}
 */
function trim(txt) {
	return txt.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/*
 * @param {String}
 * @return {String}
 * @return {String}
 * @return {String}
 */
function startsWith(txt, searchString, position) {
	position = position || 0;
	return txt.substr(position, searchString.length) === searchString;
}

/*
 * @param {String}
 * @return {String}
 * @return {String}
 * @return {String}
 */
function endWith(txt, searchString, position) {
	var subjectString = this.toString();
	if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
		position = subjectString.length;
	}
	position -= searchString.length;
	var lastIndex = subjectString.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
}

/*
 * @param {String}
 * @return {String}
 * @return {String}
 * @return {String}
 */
function includes(txt, searchString, position) {
	if (typeof position !== 'number') {
		position = 0;
	}

	if (position + searchString.length > txt.length) {
		return false;
	} else {
		return txt.indexOf(searchString, position) !== -1;
	}
}

function toCamelCase() {

}

function toDashCase() {

}

function toLowerCaseFirst() {

}

/*
 * @param {String}
 * @return {String}
 * @return {String}
 * @return {String}
 */
function installStringExpend() {
	String.prototype.trim = function () {
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
	
	String.prototype.startsWith = function(searchString, position){
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};

	String.prototype.endsWith = function(searchString, position) {
		var subjectString = this.toString();
		if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};


	String.prototype.includes = function(searchString, position) {
		if (typeof position !== 'number') {
			position = 0;
		}

		if (position + searchString.length > this.length) {
			return false;
		} else {
			return this.indexOf(searchString, position) !== -1;
		}
	};
}



/*
 * array 타입 체크
 *
 * @param {Object} Any object
 * @return {Boolean}
 */
function isArray(obj) {
	return Array.prototype.toString.call(obj)
}



function installAnimate() {

}



function assign() {

}

function is() {

}