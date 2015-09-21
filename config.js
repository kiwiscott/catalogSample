var config = module.exports = {};

// database
config.db = {
	"user": "RndUser@ebogyxibuv",
	"password": "skunkw0rks!",
	"server": "ebogyxibuv.database.windows.net",
	"database": "SkunkWorks",
	"options": {
		"encrypt": true
	}
};

config.queries = {
	"families": "FAMILIES_ALL",
	"familiesOne": "FAMILIES_ONE",
	"familiesUpsert": {
		"procedure": 'UPSERT_SERVICE_FAMILY',
		"params": ["name", "code", "externalCode", "description", "displayOrder", "moreInfoLink", "imageFileName", "shortDescription", "routeName"]
	},

	"services": "SERVICES_ALL",
	"servicesOne": "SERVICES_ONE",
	"servicesUpsert": {
		"procedure": "UPSERT_SERVICE",
		"params": ["name", "code", "description", "familyCode", "acronym", "aboutText", "moreInfoLink", "status", "targetDate", "rankSortOrder", "imageFileName", "url", "displayOrder", "routeName"]
	},

	"tiers": "TIER_ALL",
	"tiersOne": "TIER_ONE",
	"tiersUpsert": {
		"procedure": "UPSERT_SERVICE_TIER",
		"params": ["name", "code", "description", "serviceCode", "sortOrder", "rankSortOrder", "detailDescription", "isAssetPlaceHolderRequired"]
	},

	"attributes": "ATTRIBUTES_ALL",
	"attributesOne": "ATTRIBUTES_ONE",
	"attributesUpsert": {
		"procedure": "UPSERT_SKU_ATTRIBUTE_TYPE",
		"params": ["code", "name", "description", "unitOfMeasure", "isVisible", "isEnabled", "isExported", "externalCode", "isRange", "helpText", "values"]
	}
}