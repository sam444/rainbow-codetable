import config from 'config';
const _config = sessionStorage.getItem('project_config');
const API_GATEWAY_PROXY_PATH = _config != null ? JSON.parse(_config).API_GATEWAY_PROXY : "";
let _getCodeTableByNameUrl = API_GATEWAY_PROXY_PATH + 'dd/public/codetable/v1/data/list/byName';
let _getCodeTableByIdUrl = API_GATEWAY_PROXY_PATH + 'dd/public/codetable/v1/data/codeTableById';
let _getCodeTableByConditionUrl = API_GATEWAY_PROXY_PATH + 'dd/public/codetable/v1/data/condition/in';
let _getCodeTablesByNameUrl = API_GATEWAY_PROXY_PATH + 'dd/public/codetable/v1/codeTableVoList/byNameList';
let _getCommonCodeTablesUrl = API_GATEWAY_PROXY_PATH + 'urp/pub/set/loadObjectByKey?key=MainConfig.SelectConfig..';

const GET_CODETABLE_ID = _config != null ? JSON.parse(_config).GET_CODETABLE_ID :null;
if(GET_CODETABLE_ID){
    _getCodeTableByIdUrl = API_GATEWAY_PROXY_PATH+GET_CODETABLE_ID;
}


module.exports = {
    getCodeTableByNameUrl: _getCodeTableByNameUrl,
    getCodeTablesByNameUrl: _getCodeTablesByNameUrl,
    getCodeTableByIdUrl: _getCodeTableByIdUrl,
    getCodeTableByConditionUrl: _getCodeTableByConditionUrl,
    getCommonCodeTablesUrl: _getCommonCodeTablesUrl,
    codeTableKeyValue: config.DEFAULT_CODETABLE_KEYVALUE
};