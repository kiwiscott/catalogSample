/// <reference path="../../typings/tsd.d.ts"/>

var router = require('express').Router();
var handlers = {
    'lookup': require('./handlers/handler.lookup'),
    'attributes': require('./handlers/handler.attributes'),
    'tiers': require('./handlers/handler.tiers'),
    'default': require('./handlers/handler.default'),
    
};


router.route('/')
    .get(handlers.default.get)

router.route('/attributes')
    .get(handlers.attributes.getAttributes)
    .post(handlers.attributes.upsert);
    
router.route('/attributes/:code')
    .get(handlers.attributes.getOne);

router.route('/tiers')
    .get(handlers.tiers.getAll)
    .post(handlers.tiers.upsert);
router.route('/tiers/:service/:code')
    .get(handlers.tiers.getOne);
    

router.route('/:section')
    .get(handlers.lookup.get)
    .post(handlers.lookup.upsert);

router.route('/:section/:code')
    .get(handlers.lookup.getOne);



module.exports = router;

///////////////////////////////////////////////////////////
// 
// //Tiers
// //services
// //serviceFamily
// serviceTier
// service
// serviceFamily
// serviceAttribute
// serviceSku
// SELECT * FROM ServiceTier
// 
// SELECT * FROM Service
// 
// SELECT * FROM ServiceFamily
// 
// SELECT * FROM ServiceSku
// 
// SELECT * FROM [dbo].[ServiceSkuAttributeMap]
// 
// SELECT * FROM [dbo].[ServiceSkuAttributeValue]
// 
// SELECT * FROM [dbo].[ServiceSkuAttributeType]