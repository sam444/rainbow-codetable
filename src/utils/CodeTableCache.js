
let CodeTableCache = function() {
	let codeTableMap = new Map();

	let add = function(id, codeTable) {
		codeTableMap.set(id, codeTable);
	};

	let init = function() {
		codeTableMap = new Map();
	};

	let get = function(id) {
		return codeTableMap.get(id);
	};

	let getMap = function() {
		return codeTableMap;
	};

	return {
		init,
		add,
		get,
		getMap
	}
}();

module.exports = CodeTableCache;
