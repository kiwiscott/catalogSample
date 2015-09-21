/// <reference path="../../../typings/tsd.d.ts"/>
var data = require('./data');
var sql = require('mssql');
var cfg = require("../../../config");

module.exports = {
    get: get
};

function get(req, res, next) {
    var apis = [
        { "requestMethods": "GET", "url": "/api/attributes", "value": "All Attribute types / values in the system" },
        { "requestMethods": "GET", "url": "/api/attributes/{code}", "value": "Specfic Attribute type / values in the system" },
        { "requestMethods": "POST", "url": "/api/attributes/", "value": "Upserts an attribute type and its values" },

        { "requestMethods": "GET", "url": "/api/tiers", "value": "All tiers and there associated actions and attribute types" },
        { "requestMethods": "GET", "url": "/api/tiers/{serviceCode}/{code}", "value": "A single tiers and its associated actions and attribute types" },
        { "requestMethods": "POST", "url": "/api/tiers/", "value": "Upserts a tier and its assocated rules and attributes ***TODO" },

        { "requestMethods": "GET", "url": "/api/families", "value": "All service families" },
        { "requestMethods": "GET", "url": "/api/families/{code}", "value": "Specific service family" },
        { "requestMethods": "POST", "url": "/api/families/", "value": "Upserts an service family" },

        { "requestMethods": "GET", "url": "/api/services", "value": "All services in the system" },
        { "requestMethods": "GET", "url": "/api/services/{code}", "value": "A single service in the system" },
        { "requestMethods": "POST", "url": "/api/services/", "value": "Upserts a service" }
    ];
    return res.status(200).send(apis)
}

