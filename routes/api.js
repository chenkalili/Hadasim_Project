var express = require('express');
var router = express.Router();
const controller = require('../controllers/api');


router.post('/addPersonDetails', controller.addPersonDetails)

router.post('/addVaccinationDetails', controller.addVaccinationDetails)

router.post('/addCoronaResultsDates', controller.addCoronaResultsDates)

router.get('/getPersonDetails', controller.getPersonDetails);

router.get('/getVaccinationDetails', controller.getVaccinationDetails)

router.get('/getCoronaResultsDates', controller.getCoronaResultsDates)

router.get('/getDataById', controller.getDataById)
module.exports = router;
