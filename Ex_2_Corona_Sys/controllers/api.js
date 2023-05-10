const dbconnection = require('../models/dbconnection');
const createTables = require('../models/CreateTable');

createTables();
/**
 * Adds a new person to the personal_details table.
 * Only adds the person if the ID does not already exist in the table.
 *
 * @param {Object} req - The request object containing the person's details.
 * @param {Object} res - The response object.
 * @throws {Error} Throws an error if there is a database connection error or a query error.
 */
exports.addPersonDetails = (req, res) => {
    dbconnection.getConnection(function (err, connection) {
        if (err) throw err;
        let sqlCheckPerson = 'SELECT COUNT(*) AS personCount FROM personal_details WHERE id = ' + req.query.id;
        dbconnection.query(sqlCheckPerson, function (err, result) {
            if (err) throw err;
            let personCount = result[0].personCount;
            if (personCount === 0) {
                let sql = `INSERT INTO personal_details VALUES ('${req.query.firstName}', '${req.query.lastName}', '${req.query.id}', '${req.query.city}', '${req.query.street}', ${req.query.homeNumber}, '${req.query.dateOfBirth}', ${req.query.telephone}, ${req.query.mobile});`;
                dbconnection.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 person inserted");
                    connection.release();
                });
            } else {
                console.log("Person with id already exists: " + req.query.id);
                connection.release();
            }
        });
    });
};

/**
 * Adds corona results dates to the corona_results_dates table for a specific ID.
 * The corona results dates are added only if the ID exists in the personal_details table.
 *
 * @param {Object} req - The request object containing the corona results dates.
 * @param {Object} res - The response object.
 * @throws {Error} Throws an error if there is a database connection error or a query error.
 */

exports.addCoronaResultsDates = (req, res) => {
    dbconnection.getConnection(function (err, connection) {
        if (err) throw err;
        let sqlCheckPerson = 'SELECT COUNT(*) AS personCount FROM personal_details WHERE id = ' + req.query.id;
        dbconnection.query(sqlCheckPerson, function (err, result) {
            if (err) throw err;
            let personCount = result[0].personCount;
            let personExists = personCount > 0;
            if (personExists) {
                if (new Date(req.query.recoveryDate) > new Date(req.query.PositiveResultDate)) {
                    let sql = `INSERT INTO corona_results_dates VALUES ('${req.query.id}', '${req.query.positiveResultDate}', '${req.query.recoveryDate}');`;
                    dbconnection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("1 Results inserted");
                        connection.release();
                    });
                } else { console.log("Recovery date should be after the positive result date");
                    connection.release();}

            } else {console.log("ID does not exist in the personal_details table: " + req.query.id);
                connection.release();}
        });
    });
};


/**
 * Adds vaccination details to the vaccination_details table for a specific ID.
 * The vaccination details are added only if the ID exists in the personal_details table.
 *
 * @param {Object} req - The request object containing the vaccination details.
 * @param {Object} res - The response object.
 * @throws {Error} Throws an error if there is a database connection error or a query error.
 */
exports.addVaccinationDetails = (req, res) => {
    dbconnection.getConnection(function (err, connection) {
        if (err) throw err;
        let id = req.query.id;
        let vaccineDate = req.query.vaccineDate;
        let sql = `
            SELECT 
                (SELECT COUNT(*) FROM personal_details WHERE id = ${id}) AS personCount,
                (SELECT COUNT(*) FROM vaccination_details WHERE id = ${id}) AS vaccinationCount,
                (SELECT COUNT(*) FROM vaccination_details WHERE id = ${id} AND vaccineDate = '${vaccineDate}') AS dateCount;
        `;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            let personCount = result[0].personCount;
            let vaccinationCount = result[0].vaccinationCount;
            let dateCount = result[0].dateCount;
            if (personCount === 0) {
                console.log("ID does not exist in the personal_details table: " + id);
            } else if (vaccinationCount >= 4) {
                console.log("There are already 4 vaccinations for this ID: " + id);
            } else if (dateCount > 0) {
                console.log("There is already a vaccination on this date for the ID: " + id);
            } else {
                let sql = 'INSERT INTO vaccination_details VALUES (' + id + ',"'+req.query.vaccinDate+'",'+  "'"+req.query.manufacturer+ "'"+');';
                connection.query(sql, function (err) {
                    if (err) throw err;
                    console.log("1 vaccination inserted");
                    connection.release();
                });
            }
        });
    });
};


/**
 * Inserts vaccination details into the vaccination_details table.
 *
 * @param {string} id - The ID associated with the vaccination details.
 * @param {string} vaccinDate - The date of vaccination.
 * @param {string} manufacturer - The manufacturer of the vaccine.
 * @param {Object} req - The request object.
 * @param {function} callback - The callback function to execute after the insertion is completed.
 * @throws {Error} Throws an error if there is a database connection error or a query error.
 */
function insertVaccinationDetails(id, vaccinDate, manufacturer, req,connection, callback) {
    let sql = 'INSERT INTO vaccination_details VALUES (' + id + ',"'+req.query.vaccinDate+'",'+  "'"+req.query.manufacturer+ "'"+');';
    connection.query(sql, function (err) {
        if (err) throw err;
        callback();
    });
}




/**
 * Retrieves data from multiple tables based on the provided ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getDataById = async (req, res) => {
    try {
        await dbconnection.getConnection();
        console.log("Connected!");

        const id = req.query.id;
        const responseData = {};
        responseData.personalDetails = await executeQuery(`SELECT * FROM personal_details WHERE id = ${id}`);
        responseData.vaccinationDetails = await executeQuery(`SELECT * FROM vaccination_details WHERE id = ${id}`);
        responseData.coronaResultsDates = await executeQuery(`SELECT * FROM corona_results_dates WHERE id = ${id}`);

        console.log("Retrieved data:");
        console.log(responseData);
        res.json(responseData);
        //connection.release();
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Executes a SQL query and returns a promise that resolves with the query result or rejects with an error.
 * @param {string} sql - The SQL query to execute.
 * @returns {Promise} A promise that resolves with the query result or rejects with an error.
 */
function executeQuery(sql) {
    return new Promise((resolve, reject) => {
        dbconnection.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


/**
 * Retrieves personal details from the database for a given ID.
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object used to send the retrieved data as a JSON response.
 */
 exports.getPersonDetails = (req, res) => {
     dbconnection.connect(function(err,connection) {
         if (err) throw err;
         console.log("Connected!");
         let sql = "SELECT * FROM personal_details WHERE id = " + req.query.id;
         dbconnection.query(sql, function (err, result) {
             if (err) throw err;
             console.log(result); // Output the retrieved data directly
             res.json(result); // Send the retrieved data as a JSON response
             connection.release();
         });
     });
 }

/**
 * Retrieves vaccination details from the database for a given ID.
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object used to send the retrieved data as a JSON response.
 */
exports.getVaccinationDetails = (req, res) => {
    dbconnection.getConnection(function(err,connection) {
        if (err) throw err;
        console.log("Connected!");
        let sql = "SELECT * FROM vaccination_details WHERE id = " + req.query.id;
        dbconnection.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result); // Output the retrieved data directly
            res.json(result); // Send the retrieved data as a JSON response
            connection.release();
        });
    });
}

/**
 * Retrieves corona results dates from the database for a given ID.
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object used to send the retrieved data as a JSON response.
 */
exports.getCoronaResultsDates = (req, res) => {
    dbconnection.getConnection(function(err,connection) {
        if (err) throw err;
        console.log("Connected get result!");
        let sql = "SELECT * FROM corona_results_dates WHERE id =" + req.query.id;
        dbconnection.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result); // Output the retrieved data directly
            res.json(result); // Send the retrieved data as a JSON response
            connection.release();
        });
    });
}

