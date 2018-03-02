import Config from '../config/Config';
import Constant from '../constant/CodeTableConstant';

module.exports = {

    getCodeTable({ CodeTableId, ConditionMap, CodeTableName }) {
        let url;
        if (CodeTableId && ConditionMap) {
            url = Config.getCodeTableByConditionUrl;
            return AjaxUtil.call(url, { CodeTableId, ConditionMap }, {
                method: "POST"
            });
        } else if (CodeTableId) {
            url = Config.getCodeTableByIdUrl;
            return AjaxUtil.call(url, { CodeTableId }, {
                method: "GET"
            });
        }
        url = Config.getCodeTableByNameUrl;
        ConditionMap = ConditionMap ? ConditionMap : {};
        const LangId = "";
        return AjaxUtil.call(url, { CodeTableName, ConditionMap, LangId }, {
            method: "POST"
        });
    },

    fetchCodeTable(codetableUrl) {
        if (codetableUrl) {
            return AjaxUtil.call(codetableUrl.url, codetableUrl.param, codetableUrl.setting);
        } else {
            console.error("code table url is null");
        }
    },
    codeTableNames(codetableNames) {
        if (codetableNames) {
            return AjaxUtil.call(Config.getCodeTablesByNameUrl, codetableNames, { "method": "POST" });
        } else {
            console.error("code table name is null");
        }
    },

    buildCodeTable(codes) {
        let map = {}, codeTableKeyValue = Config.codeTableKeyValue;
        if (_.isEmpty(codes.BusinessCodeTableValueList)) {
            codes.BusinessCodeTableValueList = [];
        } else {
            codes.BusinessCodeTableValueList = codes.BusinessCodeTableValueList.map(code => {
                let result = {};
                for (let obj in code) {
                    if (obj === Constant.CODE_TABLE_ID) result[codeTableKeyValue.KEY] = code[obj];
                    else if (obj === Constant.CODE_TABLE_DESCRIPTION) result[codeTableKeyValue.VALUE] = code[obj];
                    else result[obj] = code[obj]
                }
                return result;
            });
            codes.BusinessCodeTableValueList.forEach(function (code) {
                map[code[codeTableKeyValue.KEY]] = code;
            });

            codes.map = map;
        }

        return codes;
    },

    sortCodeTable(codes, sorter) {
        if (sorter) { }
        sorter && sorter.sort(codes.BusinessCodeTableValueList);
        return codes;
    },

    
}