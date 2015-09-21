/// <reference path="../../../typings/tsd.d.ts"/>
var data = require('./data');
var sql = require('mssql');
var cfg = require("../../../config");

module.exports = {
    getAll: getAll,
    getOne: getOne,
    upsert: upsert
};

function getOne(req, res, next) {
    var params = [
        { "name": 'code', 'value': req.params.code },
        { "name": 'service', 'value': req.params.service }
    ];
    var query = cfg.queries['tiersOne'];
    return getIt(query, params, req, res, next, true, true);
}
function getAll(req, res, next) {
    var params = [];
    var query = cfg.queries['tiers'];
    return getIt(query, params, req, res, next, false, false);
}

function getIt(query, parameters, req, res, next, oneResult, includeAttributes) {
    data.execute(parameters, query, cfg.db)
        .then(function (data) {
            var converted = convertFromDb(data[0], includeAttributes);

            return res.status(200).send(oneResult ? converted[0] : converted);
        }, function (err) {
            res.status(401).send({ "code": 401, "message": "Sorry Oops An Error has ocured" });
        });
}


function upsert(req, res, next) {
    var dbProc = cfg.queries['attributesUpsert'];

    var body = req.body;

    var params = [];
    dbProc.params.forEach(function (key) {
        if (key != 'values')
            params.push({ "name": key, 'value': body[key] || '' });
    }, this);
    
    //Values
    params.push({ "name": "values", 'value': createValuesTable(body), 'tvp': true });

    return data.executeProc(params, dbProc.procedure)
        .then(function () {
            return res.status(200).send()
        }, function (err) {
            res.status(401).send({ "code": 401, "message": "Sorry Oops An Error has ocured" });
        });
}

function createValuesTable(data) {
    var tvp = new sql.Table()
    // Columns must correspond with type we have created in database.
    tvp.columns.add('Value', sql.VarChar(100));
    tvp.columns.add('ExternalCode', sql.VarChar(100));
    tvp.columns.add('IsEnabled', sql.Bit);
    tvp.columns.add('SortOrder', sql.Int);
    // Add rows
    data.values.forEach(function (value) {
        tvp.rows.add(value.value, value.code, value.isEnabled ? 1 : 0, value.sortOrder);
    })
    return tvp;
}

function saveToDb(data) {

}

function convertFromDb(data, includeAttributes) {
    var converted = [];
    var code = '';
    var actionCode = '';
    var index = -1;
    var actionIndex = -1;
    data.forEach(function (element) {
        var unique = element.serviceCode + ':' + element.code;
        if (unique !== code) {
            //Increment the index
            index++;
            actionIndex = -1;
            actionCode = '';
            code = unique,
            converted.push({
                "serviceCode": element.serviceCode,
                "tierCode": element.code,
                "name": element.name,
                "description": element.description,
                "sortOrder": element.sortOrder,
                "rankSortOrder": element.rankSortOrder,
                "detailDescription": element.detailDescription,
                "isAssetPlaceHolderRequired": element.isAssetPlaceHolderRequired,
                "actions": []
            });
        }
        if (element.actionCode !== actionCode) {
            actionIndex++;
            actionCode = element.actionCode;
            if (includeAttributes) {
                converted[index].actions.push({ "name": element.actionName, "actionCode": element.actionCode, "attributes": [] });
            }
            else {
                converted[index].actions.push({ "name": element.actionName, "actionCode": element.actionCode });
            }
        }
        if (includeAttributes) {
            converted[index].actions[actionIndex].attributes.push({ "code": element.attrTypeCode, "name": element.attrTypeName, "description": element.attrTypeDescription })
        }
    }, this);
    return converted;
}