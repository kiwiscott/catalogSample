/// <reference path="../../../typings/tsd.d.ts"/>
var data = require('./data');
var sql = require('mssql');
var cfg = require("../../../config");

module.exports = {
    getAttributes: getAttributes,
    getOne: getOne,
    upsert: upsert
};

function getOne(req, res, next) {
    var params = [
        { "name": 'value', 'value': req.params.code }
    ];
    var query = cfg.queries['attributesOne'];
    return getIt(query, params, req, res, next, true);

}
function getAttributes(req, res, next) {
    var params = [];
    var query = cfg.queries['attributes'];
    return getIt(query, params, req, res, next, false);
}

function getIt(query, parameters, req, res, next, oneResult) {
    data.execute(parameters, query, cfg.db)
        .then(function (data) {
            var converted = convertFromDb(data[0]);

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
    var converted = [];
    var code = '';
    var index = -1;
    data.forEach(function (element) {
        if (element.internalCode !== code) {
            //Increment the index
            index++;
            code = element.internalCode
            converted.push({
                "code": element.internalCode,
                "name": element.name,
                "description": element.description,
                "unitOfMeasure": element.unitOfMeasure,
                "isVisible": element.isVisible,
                "isEnabled": element.isEnabled,
                "isExported": element.isExported,
                "externalCode": element.externalCode,
                "isRange": element.isRange,
                "helpText": element.helpText,
                "values": []
            });
        }
        converted[index].values.push({ "value": element.attrValue, "code": element.attrValueCode, "isEnabled": element.attrIsEnabled, "sortOrder": element.attrSortOrder })
    }, this);
    return converted;
}

function convertFromDb(data) {
    var converted = [];
    var code = '';
    var index = -1;
    data.forEach(function (element) {
        if (element.internalCode !== code) {
            //Increment the index
            index++;
            code = element.internalCode
            converted.push({
                "code": element.internalCode,
                "name": element.name,
                "description": element.description,
                "unitOfMeasure": element.unitOfMeasure,
                "isVisible": element.isVisible,
                "isEnabled": element.isEnabled,
                "isExported": element.isExported,
                "externalCode": element.externalCode,
                "isRange": element.isRange,
                "helpText": element.helpText,
                "values": []
            });
        }
        converted[index].values.push({ "value": element.attrValue, "code": element.attrValueCode, "isEnabled": element.attrIsEnabled, "sortOrder": element.attrSortOrder })
    }, this);
    return converted;
}