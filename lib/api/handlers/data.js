/// <reference path="../../../typings/tsd.d.ts"/>
var sql = require('mssql');
var util = require('util');

var Promise = require('promise');
var log4js = require('log4js');
var moment = require('moment')
var cfg = require("../../../config");
var applog = log4js.getLogger("sql");

module.exports = {
    execute: execute,
    executeProc: executeProc
};


function executeProc(parameters, query) {
    var db = cfg.db;
    return new Promise(function (resolve, reject) {
        var start = moment();

        var connection = new sql.Connection(db, function (err) {
            var request = new sql.Request(connection);
            buildParams(request, parameters);
            request.execute(query, function (err, recordset, returnValue) {
                var secondsDiff = moment().diff(start, 'milliseconds');
                if (err) {
                    applog.error(secondsDiff + 'ms\t' + db.database + '\t' + query + '\t' + JSON.stringify(parameters) + '\t' + JSON.stringify(err));
                    reject(err);
                }
                else {
                    applog.debug(secondsDiff + 'ms\t' + db.database + '\t' + query + '\t' + JSON.stringify(parameters));
                    resolve(returnValue);
                }
            });
        });
    });
};
function buildParams(request, parameters) {
    parameters.forEach(function (param) {
        if (param.tvp === true) {
            request.input(param.name, param.value);
        }
        else if (util.isDate(param.value)) {
            request.input(param.name, sql.DateTime, param.value);
        }
        else if (typeof param.value === "number") {
            request.input(param.name, sql.Int, param.value);
        }
        else {
            request.input(param.name, sql.VarChar, param.value);
        }
    });
}

function execute(parameters, query) {
    var db = cfg.db;
    return new Promise(function (resolve, reject) {
        var start = moment();

        var connection = new sql.Connection(db, function (err) {
            var request = new sql.Request(connection);
            buildParams(request, parameters);
            request.execute(query, function (err, recordset,returnCode) {
                var secondsDiff = moment().diff(start, 'milliseconds');
                if (err) {
                    applog.error(secondsDiff + 'ms\t' + db.database + '\t' + query + '\t' + JSON.stringify(parameters) + '\t' + JSON.stringify(err));
                    reject(err);
                }
                else {
                    applog.debug(secondsDiff + 'ms\t' + db.database + '\t' + query + '\t' + JSON.stringify(parameters));
                    resolve(recordset);
                }
            });
        });
    });
};