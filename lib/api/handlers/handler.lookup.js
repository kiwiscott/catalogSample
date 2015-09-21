/// <reference path="../../../typings/tsd.d.ts"/>
var data = require('./data');
var cfg = require("../../../config");

module.exports = {
    get: getData,
    getOne: getOne,
    upsert: upsert
};

function getOne(req, res, next) {
    var params = [
        { "name": 'value', 'value': req.params.code }
    ];
    var queryName = req.params.section;
    //We build up the query here
    var query = cfg.queries[queryName + 'One'];
    return getIt(query, params, req, res, next,true);
}

function getData(req, res, next) {
    var params = [];
    var queryName = req.params.section;

    return getIt(cfg.queries[queryName], params, req, res, next,false);
}


function upsert(req, res, next) {
    var section = req.params.section;
    var dbProc = cfg.queries[section + 'Upsert'];

    var body = req.body;

    var params = [];
    dbProc.params.forEach(function (key) {
        params.push({ "name": key, 'value': body[key] || '' });
    }, this);

    return data.executeProc(params, dbProc.procedure)
        .then(function () {
            return res.status(200).send()
        }, function (err) {
            res.status(401).send({ "code": 401, "message": "Sorry Oops An Error has ocured" });
        });
}


function getIt(query, parameters, req, res, next,oneResult) {
    data.execute(parameters, query)
        .then(function (data) {
            return res.status(200).send(oneResult ? data[0][0] : data[0]);
        }, function (err) {
            res.status(401).send({ "code": 401, "message": "Sorry Oops An Error has ocured" });
        });
}