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
        let sql = `
            INSERT INTO personal_details 
            SELECT * FROM (
                SELECT '${req.query.firstName}', '${req.query.lastName}', ${req.query.id}, 
                       '${req.query.city}', '${req.query.street}', ${req.query.homeNumber}, 
                       '${req.query.dateOfBirth}', '${req.query.telephone}', '${req.query.mobile}'
            ) AS tmp
            WHERE NOT EXISTS (
                SELECT 1 FROM personal_details WHERE id = ${req.query.id}
            );
        `;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            if (result.affectedRows === 1) { console.log("1 person inserted");
            } else { console.log("Person with id already exists: " + req.query.id);
            }
            connection.release();
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

        let id = req.query.id;
        let positiveResultDate = req.query.positiveResultDate;
        let recoveryDate = req.query.recoveryDate;
        let sql = `
            INSERT INTO corona_results_dates (id, positiveResultDate, recoveryDate)
            SELECT p.id, '${positiveResultDate}', '${recoveryDate}'
            FROM personal_details p
            LEFT JOIN corona_results_dates c ON p.id = c.id
            WHERE p.id = ${id} AND c.id IS NULL
              AND '${recoveryDate}' > '${positiveResultDate}';
        `;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            if (result.affectedRows === 1) {
                console.log("1 result inserted");
            } else {
                console.log("ID does not exist in the personal_details table, already has corona results, or recovery date is not after positive result date");
            }
            connection.release();
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
        let vaccinDate = req.query.vaccinDate;
        let manufacturer = req.query.manufacturer;

        let sql = `
      INSERT INTO vaccination_details
      SELECT * FROM (
        SELECT '${id}', '${vaccinDate}', '${manufacturer}'
      ) AS temp
      WHERE EXISTS (
        SELECT 1 FROM personal_details WHERE id = '${id}'
      ) AND (
        SELECT COUNT(*) FROM vaccination_details WHERE id = '${id}'
      ) < 4 AND NOT EXISTS (
        SELECT 1 FROM vaccination_details WHERE id = '${id}' AND vaccinDate = '${vaccinDate}'
      )
    `;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            if (result.affectedRows === 0) {
                console.log("There are more than four vaccinations for this id, or this date already exists for the id");
            } else {
                console.log("1 vaccination inserted");
            }
            connection.release();
        });
    });
};


/**
 * Retrieves data from multiple tables based on the provided ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getDataById = (req, res) => {
    const id = req.query.id;
    const sql = `
    SELECT pd.*, vd.*, crd.*
    FROM personal_details AS pd
    JOIN vaccination_details AS vd ON pd.id = vd.id
    JOIN corona_results_dates AS crd ON pd.id = crd.id
    WHERE pd.id = ${id}
  `;
    dbconnection.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        console.log(result); // Output the retrieved data directly
        res.json(result); // Send the retrieved data as a JSON response
    });
};


/**
 * Retrieves personal details from the database for a given ID.
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object used to send the retrieved data as a JSON response.
 */
exports.getPersonDetails = (req, res) => {
    const sql = "SELECT * FROM personal_details";
    dbconnection.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result);
    });
};



/**
 * Retrieves vaccination details from the database for a given ID.
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object used to send the retrieved data as a JSON response.
 */
exports.getVaccinationDetails = (req, res) => {
    const sql = "SELECT * FROM vaccination_details";
    dbconnection.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result);
    });
};

/**
 * Retrieves corona results dates from the database for a given ID.
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object used to send the retrieved data as a JSON response.
 */
exports.getCoronaResultsDates = (req, res) => {
    const sql = "SELECT * FROM corona_results_dates";
    dbconnection.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result);
    });
};
/**
 * All people who have been actively sick in the last month
 * @param reqThe request object containing the query parameters.
 * @param {Object} res - The response object used to send the retrieved data as a JSON response.
 */
exports.getPatientsByDay = (req, res) => {
    const currentDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    const sql = `
    SELECT Date(positiveResultDate) AS Date, GROUP_CONCAT(ID) AS Patients
    FROM CORONA_RESULTS_DATES
    WHERE positiveResultDate >= '${lastMonthDate.toISOString().split('T')[0]}' AND recoveryDate <= '${currentDate.toISOString().split('T')[0]}'
    GROUP BY Date(positiveResultDate)
    ORDER BY Date(positiveResultDate)
  `;
    dbconnection.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        const formattedResult = result.map(entry => ({
            Date: new Date(entry.Date).toISOString().split('T')[0],
            Patients: entry.Patients
        }));
        res.json(formattedResult);
    });
};

/**
 * All the people who were not vaccinated
 * @param req
 * @param res
 */
exports.getUnvaccinated = (req, res) => {
    const query = `
        SELECT COUNT(*) AS UnvaccinatedCount
        FROM personal_details
        WHERE ID NOT IN (SELECT ID FROM vaccination_details)
    `;
    dbconnection.query(query, (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).send('An error occurred while fetching the unvaccinated count.');
        } else {
            const unvaccinatedCount = result[0].UnvaccinatedCount;
            res.json({ count: unvaccinatedCount });
        }
    });
};
