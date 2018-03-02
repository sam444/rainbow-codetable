import CodeTableService from '../service/CodeTableService';
import {SessionContext,PageContext} from "rainbow-foundation-cache";
import Config from '../config/Config';

/**
 * @module CodeTableService
 */
module.exports = {

	/**
     * get codetable by codetable id and ConditionMap
     * @param  {Object} param -is a json object
     * @param  {Function} callback -is a option, once get codetable date will run callback function
     * @example
     * import {CodeTableService} from 'rainbow-foundation-codetable';
	 * let param = {
	 * 		CodeTableId:12345,
	 * 		ConditionMap:{"IsDisplay":"Y"},
	 * }
     * CodeTableService.getCodeTable(param).then((data)=>{
	 * 		//handler something
	 * });
     */
	getCodeTable({CodeTableId, ConditionMap,CodeTableName}, callback) {
		return new Promise(resolve => {
			const key = this.buildKey({CodeTableId, ConditionMap,CodeTableName});
			let tmpCodeTable = SessionContext.get(key);
			if (tmpCodeTable) {
				let codeTableObj = {codes: tmpCodeTable.BusinessCodeTableValueList};
				resolve(codeTableObj);
				callback && callback(codeTableObj);
				return;
			}
			return CodeTableService.getCodeTable({CodeTableId, ConditionMap,CodeTableName})
				.then(tmpCodeTable => {
					const isCache = tmpCodeTable["BusinessCodeTable"]["NeedCache"];
					const isUser = tmpCodeTable["BusinessCodeTable"]["isUser"];

					tmpCodeTable = CodeTableService.buildCodeTable(tmpCodeTable);
					delete  tmpCodeTable["BusinessCodeTable"];
					delete  tmpCodeTable["map"];
					SessionContext.put(key, tmpCodeTable);
					
					let codeTableObj = {codes: tmpCodeTable.BusinessCodeTableValueList};
					return CodeTableService.getCodeTable({CodeTableId, ConditionMap,CodeTableName})
					.then(tmpCodeTable => {
						const isCache = tmpCodeTable["BusinessCodeTable"]["NeedCache"];
						tmpCodeTable = CodeTableService.buildCodeTable(tmpCodeTable);
						delete  tmpCodeTable["BusinessCodeTable"];
						delete  tmpCodeTable["map"];
						SessionContext.put(key, tmpCodeTable);
						let codeTableObj = {codes: tmpCodeTable.BusinessCodeTableValueList};
						if(isUser){
							AjaxUtil.call(Config.getCommonCodeTablesUrl+CodeTableName).then((common)=>{
								delete common["default"];
								const commonArry = [];
								_.each(_.keys(common),(key)=>{
									commonArry.push({"id":common[key]["key"],"text":common[key]["value"]}); 
								});
								codeTableObj["common"]= commonArry;
								resolve(codeTableObj);
								callback && callback(codeTableObj);
							})
						}else{
							resolve(codeTableObj);
							callback && callback(codeTableObj);
						}
						
					})
				})
		})
	},
	/**
     * get codetable by codetable id and ConditionMap
     * @param  {Object} param -is a json object
     * @param  {Function} callback -is a option, once get codetable date will run callback function
     * @example
     * import {CodeTableService} from 'rainbow-foundation-codetable';
	 * let param = {
	 * 		CodeTableId:12345,
	 * 		ConditionMap:{"IsDisplay":"Y"},
	 * }
     * CodeTableService.getCodeTable(param).then((data)=>{
	 * 		//handler something
	 * });
     */
	loadCodeTable({CodeTableId, ConditionMap,CodeTableName}) {
		return new Promise(resolve => {
			const key = this.buildKey({CodeTableId, ConditionMap,CodeTableName});
			let tmpCodeTable = SessionContext.get(key);
			if (tmpCodeTable) {
				resolve(tmpCodeTable);
				return;
			}
			return CodeTableService.getCodeTable({CodeTableId, ConditionMap,CodeTableName})
				.then(codeTableObj => {
					const isCache = codeTableObj["BusinessCodeTable"]["NeedCache"];
					tmpCodeTable = CodeTableService.buildCodeTable(codeTableObj);
					if(isCache=='Y'){
						SessionContext.put(key, tmpCodeTable);
					}
					resolve(tmpCodeTable);
				})
		})
	},
	/**
     * get codetable by url
     * @param  {Object} param -is a json object
     * @param  {Function} callback -is a option, once get codetable date will run callback function
     * @example
     * import {CodeTableService} from 'rainbow-foundation-codetable';
	 * const url = 'http://172.25.17.213/restlet/v1/getQuotuionNumber';
	 * const filterExpression = 'QuotuionNumber="001"';
     * CodeTableService.getCodeTable(url,filterExpression).then((data)=>{
	 * 		//handler something
	 * });
	 * 
	 * //url return data format
	 * {
	 * 	.....
	 *  codes:[
	 * 		{'id':'1','text':'shanghai'},
	 * 		{'id':'2','text':'beijing'}
	 * 	]
	 *  ......
	 * }
     */
    fetchCodeTable(url,filterExpression, callback) {
        return new Promise(resolve => {
            return CodeTableService.fetchCodeTable(url)
                .then(tmpCodeTable => {
                    let codeTableObj = tmpCodeTable;
                    if(filterExpression) codeTableObj = this._filterCodeTable(tmpCodeTable, filterExpression);
                    resolve(codeTableObj);
                    callback && callback(codeTableObj);
                })
        })
	},

	getCodeTableByNames(codeTableNames) {
        return new Promise(resolve => {
            return CodeTableService.codeTableNames(codeTableNames)
                .then(tmpCodeTable => {
                    resolve(tmpCodeTable);
                })
        })
	},
	
	buildKey({CodeTableId, ConditionMap,CodeTableName}){
		let key = ConditionMap?'C_'+CodeTableId+JSON.stringify(ConditionMap):'C_'+CodeTableId;
		key = CodeTableName?ConditionMap?'C_'+CodeTableName+JSON.stringify(ConditionMap):'C_'+CodeTableName:key;
		return key;
	},

	_filterCodeTable(codeTable, filterExpression) {
		if (!filterExpression) return codeTable;
		let codes = codeTable.codes;
		let result = codes.filter(code => {
			let conditionFields = code.ConditionFields;
			if (!conditionFields) return true;
			let isEqual = conditionFields.some(condition => {
				let evalStr = '';
				let fields = Object.keys(condition);
				fields.forEach(field => {
					//number, no quotation
					if (!isNaN(condition[field])) evalStr += `let ${field}=${condition[field]};`;
					//not number
					else evalStr += `let ${field}='${condition[field]}';`;
				});
				return eval(`${evalStr};${filterExpression}`);
			});
			return isEqual;
		});
		let tmpCodeTable = CodeTableService.buildCodeTable({BusinessCodeTableValueList: result});
		return {codes: tmpCodeTable.BusinessCodeTableValueList, map: tmpCodeTable.map};
	},
	handleCodetableList() {
        const arrayMap = PageContext.get("rainbow-codetableName-map");
        if (arrayMap) {
            const arraylist = [];
            arrayMap.forEach((codetable) => {
                arraylist.push(codetable);
            });
            this.getCodeTableByNames(arraylist).then((codetableNames) => {
                let codetabkMap = PageContext.get("rainbow-codetable-map");
                if (codetabkMap) {
                    _.each(codetableNames, (names) => {
						const codetableName = names.BusinessCodeTable["Name"];
						const isCache = codeTableObj["BusinessCodeTable"]["NeedCache"];
                        const conditionMap = names["ConditionMap"] ? names["ConditionMap"] : {};
                        const key = codetableName + JSON.stringify(conditionMap);
						const cacheKey = this.buildKey({ "CodeTableName": codeTableName, "ConditionMap": conditionMap });
						const tmpCodeTable = CodeTableService.buildCodeTable(names);
						delete  tmpCodeTable["BusinessCodeTable"];
						delete  tmpCodeTable["map"];
						if(isCache=='Y'){
							SessionContext.put(key, tmpCodeTable);
						}
                        codetabkMap.get(key).forEach((codetableObject) => {
                            if (codetableObject.props.io == "in") {
                                if (codetableObject.props.componentType == 'RADIO' || codetableObject.props.componentType == 'CHECKBOX') {
                                    codetableObject.handlerCheckBoxAndRadio4In(names);
                                } else {
                                    const element = codetableObject.getSelfElement(codetableObject.componentId);
                                    codetableObject.handlerSelect4In(names, element);
                                }
                            } else {
                                const value = codetableObject.getComponentValue();
                                codetableObject.handler4Out(names, value);
                            }

                        });
                    })
                }
                //PageContext.remove("rainbow-codetable-map");
                //PageContext.remove("rainbow-codetableName-map");
            });
        }
    }
}
