var express = require('express');
var router = express.Router();
const controller = require('../controllers/api');


router.post('/addPerson', controller.addPersonDetails)

router.post('/addVaccin', controller.addVaccinationDetails)

router.post('/addCoronaResults', controller.addCoronaResultsDates)

router.get('/getPerson', controller.getPersonDetails);

router.get('/getVaccin', controller.getVaccinationDetails)

router.get('/getCoronaResult', controller.getCoronaResultsDates)

router.get('/getData', controller.getDataById)

router.get('/getPatientsByDay',controller.getPatientsByDay);

router.get('/getUnvaccinated',controller.getUnvaccinated);

module.exports = router;
