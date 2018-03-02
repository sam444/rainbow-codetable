import CodeTableConstant from '../constant/CodeTableConstant';

export default class IndexedDBService {

	initDatabase() {
		return new Promise((resolve, reject) => {
			let self = this;
			if (!indexedDB) resolve(false);
			if (self.db) resolve(true);

			let request = indexedDB.open(CodeTableConstant.DB_NAME, CodeTableConstant.DB_VERSION);
			request.onupgradeneeded = function (event) {
				self.db = event.target.result;
				self.db.createObjectStore(CodeTableConstant.DB_STORE_NAME);
				self.transaction = event.target.transaction;
				resolve(true);
			};
			request.onsuccess = function (event) {
				self.db = event.target.result;
				resolve(true);
			};
			request.onerror = function (event) {
				self.db = null;
				resolve(false)
			};
		});
	}

	putData(codeTableObj) {
		let self = this, result;
		return new Promise((resolve, reject) => {
			let transaction = self.transaction || self.db.transaction(CodeTableConstant.DB_STORE_NAME, CodeTableConstant.TRANSACTION_OPTION_READWRITE);
			let store = transaction.objectStore(CodeTableConstant.DB_STORE_NAME);
			let request = store.put(codeTableObj, codeTableObj.name + '-' + codeTableObj.productId);
			request.onsuccess = function () {
				// resolve(true);
				result = true;
			};
			request.onerror = function (event) {
				reject(event);
			};
			transaction.oncomplete = function(event) {
				delete self.transaction;
				resolve(result);
			};
		});
	}

	deleteData(codeTableObj) {
		let self = this;
		return new Promise((resolve, reject) => {
			let transaction = self.db.transaction(CodeTableConstant.DB_STORE_NAME, CodeTableConstant.TRANSACTION_OPTION_READWRITE);
			let store = transaction.objectStore(CodeTableConstant.DB_STORE_NAME);
			let request = store.delete(codeTableObj.name + '-' + codeTableObj.productId);
			request.onsuccess = function () {
				result = true;
			};
			request.onerror = function (event) {
				reject(event);
			};
			transaction.oncomplete = function(event) {
				delete self.transaction;
				resolve(result);
			};
		});
	}

	loadData(codeTableObj) {
		let self = this, result;
		return new Promise((resolve, reject) => {
			let transaction = self.transaction || self.db.transaction(CodeTableConstant.DB_STORE_NAME, CodeTableConstant.TRANSACTION_OPTION_READWRITE);
			let store = transaction.objectStore(CodeTableConstant.DB_STORE_NAME);
			let request = store.get(codeTableObj.name + '-' + codeTableObj.productId);
			request.onsuccess = function () {
				// resolve(request.result);
				result = request.result;
			};
			request.onerror = function (event) {
				reject(event);
			};
			transaction.oncomplete = function(event) {
				delete self.transaction;
				resolve(result);
			};
		});
	}
}
