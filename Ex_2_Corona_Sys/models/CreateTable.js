const dbconnection = require('./dbconnection'); // Import the dbconnection module

// Create tables if they don't exist
const createTables = () => {
    // SQL queries for table creation
    const createPersonaldetailsTable = `
    CREATE TABLE IF NOT EXISTS personal_details (
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      id INT(11) NOT NULL,
      city VARCHAR(255),
      street VARCHAR(255),
      homeNumber VARCHAR(20),
      dateOfBirth DATE,
      telephone VARCHAR(20),
      mobile VARCHAR(20),
      PRIMARY KEY(id)
    )
  `;

    const createVaccinationdetailsTable = `
    CREATE TABLE IF NOT EXISTS vaccination_details (
      id INT NOT NULL,
      vaccinDate DATE,
      manufacturer VARCHAR(255),
      FOREIGN KEY(id) REFERENCES personal_details(id)
    )
  `;

    const createCoronaResultsDatesTable = `
    CREATE TABLE IF NOT EXISTS corona_results_dates (
      id INT NOT NULL,
      positiveResultDate DATE,
      recoveryDate DATE,
      FOREIGN KEY(id) REFERENCES personal_details(id)
    )
  `;

    dbconnection.query(createPersonaldetailsTable, function(err, result) {
        if (err) throw err;
        if (result.warningCount === 0) {
            console.log("personaldetails table created successfully");
        }
    });

    dbconnection.query(createVaccinationdetailsTable, function(err, result) {
        if (err) throw err;
        if (result.warningCount === 0) {
            console.log("vaccinationdetails table created successfully");
        }
    });

    dbconnection.query(createCoronaResultsDatesTable, function(err, result) {
        if (err) throw err;
        if (result.warningCount === 0) {
            console.log("corona_results_dates table created successfully");
        }
    });// Close the database connection after table creation
};

module.exports = createTables;
