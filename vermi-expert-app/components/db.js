import SQLite from 'react-native-sqlite-storage';

// Enable debugging
SQLite.enablePromise(true);

// Open database and enable foreign key support
const db = SQLite.openDatabase({
  name: 'mydatabase.db',
  location: 'default',
});

db.then(database => {
  database.executeSql('PRAGMA foreign_keys = ON;');
});

// Function to initialize database schema
export const initializeDatabase = async () => {
  try {
    const database = await db;
    database.transaction(tx => {
      // Create the bed table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS bed (
          bedId INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT, 
          length TEXT,
          width TEXT,
          depth TEXT,
          material TEXT,
          location TEXT,
          dateCreated DATETIME
        )`,
        [],
        () => {
          console.log('Bed table created successfully');
        },
        error => {
          console.error('Error creating bed table:', error);
        }
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS favorites (
          favoriteId INTEGER PRIMARY KEY AUTOINCREMENT, 
          analysisId INTEGER, 
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (analysisId) REFERENCES analysis (analysisId)
        )`,
        [],
        () => {
          console.log('Favorite table created successfully');
        },
        error => {
          console.error('Error creating favorite table:', error);
        }
      );

      // Create the analysis table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS analysis (
          analysisId INTEGER PRIMARY KEY AUTOINCREMENT,
          bedId INTEGER,
          temperature REAL,
          moisture REAL,
          pH REAL,
          conclusion TEXT,
          recommendations TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (bedId) REFERENCES bed (bedId)
        )`,
        [],
        () => {
          console.log('Analysis table created successfully');
        },
        error => {
          console.error('Error creating analysis table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Insert a sample row into the bed table


export const addBed = async (bed) => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO bed (name, length, width, depth, material, location, dateCreated)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [bed.name, bed.length, bed.width, bed.depth, bed.material, bed.location, bed.dateCreated ],
        () => {
          console.log('New row inserted into bed table');
        },
        error => {
          console.error('Error inserting new bed row into bed table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error inserting sample bed:', error);
  }
};

export const addFavorite = async (bedId) => {
  try {
    const database = await db;
    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO favorites (analysisId)
         VALUES (?)`,
        [bedId],
        () => {
          console.log('New row inserted into favorite table');
        },
        error => {
          console.error('Error inserting new bed row into favorite table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error inserting favorite bed:', error);
  }
};

export const updateBed = async (bed) => {
  try {
    const database = await db; // Wait for database connection
    database.transaction(tx => {
      tx.executeSql(
        `UPDATE bed 
         SET name = ?, length = ?, width = ?, depth = ?, material = ?, location = ?, dateCreated = ?
         WHERE bedId = ?`, // Added WHERE clause to specify which row to update
        [bed.name, bed.length, bed.width, bed.depth, bed.material, bed.location, bed.dateCreated, bed.bedId],
        () => {
          console.log('Bed row successfully updated');
        },
        error => {
          console.error('Error updating bed row in bed table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error during the database transaction:', error);
  }
};


export const deleteBed = async (bedId) => {
  try {
    const database = await db; // Ensure the database is ready
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        // Step 0: Disable Foreign Key Constraints
        tx.executeSql('PRAGMA foreign_keys = OFF;', [], () => {
          console.log('Foreign key constraints disabled.');

          // Step 1: Delete from favorites (if records exist)
          tx.executeSql(
            'DELETE FROM favorites WHERE analysisId IN (SELECT analysisId FROM analysis WHERE bedId = ?)',
            [bedId],
            (_, result) => console.log(`Deleted ${result.rowsAffected} favorite(s) linked to bedId ${bedId}`),
            (_, error) => {
              console.log('Error deleting from favorites', error);
              reject(error);
            }
          );

          // Step 2: Delete from analysis
          tx.executeSql(
            'DELETE FROM analysis WHERE bedId = ?',
            [bedId],
            (_, result) => console.log(`Deleted ${result.rowsAffected} analysis record(s) for bed ${bedId}`),
            (_, error) => {
              console.log('Error deleting from analysis', error);
              reject(error);
            }
          );

          // Step 3: Delete from bed table
          tx.executeSql(
            'DELETE FROM bed WHERE bedId = ?',
            [bedId],
            (_, result) => {
              if (result.rowsAffected > 0) {
                console.log(`Bed with id ${bedId} deleted successfully`);
              } else {
                console.log('No row found to delete in bed table');
              }
              resolve(true);
            },
            (_, error) => {
              console.log('Error deleting bed', error);
              reject(error);
            }
          );

          // Step 4: Re-enable Foreign Key Constraints
          tx.executeSql('PRAGMA foreign_keys = ON;', [], () => {
            console.log('Foreign key constraints enabled.');
          });
        });
      });
    });
  } catch (error) {
    console.log('Error opening database', error);
    throw error;
  }
};



export const deleteFavorite = async (bedId) => {
  try {
    const database = await db; // Ensure the database is ready
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          'DELETE FROM favorites WHERE analysisId = ?',
          [bedId],
          (tx, result) => {
            if (result.rowsAffected > 0) {
              console.log(`Bed with id ${bedId} deleted successfully`);
              resolve(true);
            } else {
              console.log('No row found to delete');
              resolve(false);
            }
          },
          (tx, error) => {
            console.log('Error deleting bed', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.log('Error opening database', error);
    throw error;
  }
};


// Insert a sample row into the analysis table
export const insertSampleAnalysis = async () => {
  try {
    const database = await db; // Ensure the database connection
    database.transaction(tx => {
      // Query to find the corresponding bedId
      tx.executeSql(
        `SELECT * FROM bed WHERE name = ?`,
        ['Vermibed A'],
        (_, result) => {
          if (result?.rows?.length) {
            const bedId = result.rows.item(0).bedId; // Extract the bedId safely
            console.log('Fetched bedId:', bedId);

            // Insert analysis only if the bedId is valid
            tx.executeSql(
              `INSERT INTO analysis (bedId, temperature, moisture, pH, conclusion, recommendations)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [bedId, 25.5, 60.3, 7.2, 'Favorable', 'Maintain current environment and monitor regularly.'],
              () => {
                console.log('Sample row inserted into analysis table');
              },
              error => {
                console.error('Error inserting sample row into analysis table:', error);
              }
            );
          } else {
            console.error('Error: Bed ID not found');
          }
        },
        error => {
          console.error('Error querying bed table:', error);
        }
      );
    });
  } catch (error) {
    console.error('Unexpected error during sample analysis insertion:', error);
  }
};

export const insertAnalysis = async (data) => {
  console.log("data received", data)
  try {
    const database = await db; // Ensure the database connection
    database.transaction(tx => {
      // Query to find the corresponding bedId
      // Insert analysis only if the bedId is valid
      tx.executeSql(
        `INSERT INTO analysis (bedId, temperature, moisture, pH, conclusion, recommendations)
          VALUES (?, ?, ?, ?, ?, ?)`,
        [data.bedId, data.temperature, data.moisture, data.pH, data.conclusion, data.recommendation],
        () => {
          console.log('Analysis inserted into analysis table');
        },
        error => {
          console.error('Error inserting row into analysis table:', error);
        }
      );
          
    });
  } catch (error) {
    console.error('Unexpected error during sample analysis insertion:', error);
  }
};
// Function to delete the database
export const dropAllTables = async () => {
  try {
    const database = await SQLite.openDatabase({
      name: 'mydatabase.db',
      location: 'default',
    });

    // Fetch all table names from sqlite_master
    const tableList = await new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('sqlite_sequence');`,
          [],
          (_, result) => {
            resolve(result.rows._array.map(row => row.name));
          },
          error => {
            reject(error);
          }
        );
      });
    });

    console.log('Tables to drop:', tableList);

    // Drop each table
    await Promise.all(
      tableList.map(table =>
        new Promise((resolve, reject) => {
          database.transaction(tx => {
            tx.executeSql(
              `DROP TABLE IF EXISTS ${table};`,
              [],
              () => {
                console.log(`Dropped table: ${table}`);
                resolve();
              },
              error => {
                console.error(`Error dropping table ${table}:`, error);
                reject(error);
              }
            );
          });
        })
      )
    );

    console.log('All tables dropped successfully');
    database.close();
  } catch (error) {
    console.error('Error dropping tables:', error);
  }
};

// Function to fetch all beds from the bed table
export const fetchBeds = async () => {
  const database = await db;
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM bed`,
        [],
        (_, results) => {
          // console.log('Total rows in bed table:', results.rows.length);
          const bedArray = [];
          const len = results.rows.length;

          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
              // console.log('Row item:', row);
            bedArray.push(row);
          }

          resolve(bedArray);
        },
        error => {
          console.error('Error fetching beds:', error);
          reject(error);
        }
      );
    });
  });
};

export const fetchLatestAssessmentId = async () => {
  const database = await db;
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `SELECT analysisId FROM analysis ORDER BY analysisId DESC LIMIT 1`, // Get the latest analysisId
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0).analysisId); // Return only the latest analysisId
          } else {
            resolve(null); // Return null if no data found
          }
        },
        error => {
          console.error('Error fetching latest analysisId:', error);
          reject(error);
        }
      );
    });
  });
};


export const fetchFavorites = async () => {
  const database = await db;
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `SELECT f.*, a.*, b.* FROM favorites f
          INNER JOIN analysis a ON f.analysisId = a.analysisId
          INNER JOIN bed b ON a.bedId = b.bedId
          `,
        [],
        (_, results) => {
          // console.log('Total rows in bed table:', results.rows.length);
          const bedArray = [];
          const len = results.rows.length;

          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
              // console.log('Row item:', row);
            bedArray.push(row);
          }

          resolve(bedArray);
        },
        error => {
          console.error('Error fetching beds:', error);
          reject(error);
        }
      );
    });
  });
};

export const fetchBedName = async (id) => {
  const database = await db;
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `SELECT name FROM bed WHERE bedId = ?`,
        [id],
        (_, results) => {
          // console.log('Total rows in bed table:', results.rows.length);
          const bedArray = [];
          const len = results.rows.length;

          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
              // console.log('Row item:', row);
            bedArray.push(row);
          }

          resolve(bedArray);
        },
        error => {
          console.error('Error fetching bed name:', error);
          reject(error);
        }
      );
    });
  });
};
// Function to fetch the latest analysis entry from the analysis table
export const fetchLatestAnalysis = async () => {
  try {
    const databaseConnection = await db; // Ensure database connection is established
    if (!databaseConnection) {
      throw new Error('Database connection failed.');
    }

    return new Promise((resolve, reject) => {
      databaseConnection.transaction(tx => {
        tx.executeSql(
          `SELECT a.*, b.* FROM analysis a INNER JOIN bed b ON a.bedId = b.bedId ORDER BY timestamp DESC LIMIT 1;`,
          [],
          (_, result) => {

            if (result?.rows?.length) {
              const rowsArray = [];
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                rowsArray.push(row);
              }
              resolve(rowsArray);
            } else {
              console.log('No data found in analysis table.');
              resolve([]); 
            }
          },
          error => {
            console.error('Query error:', error);
            reject(error); 
          }
        );
      });
    });
  } catch (error) {
    console.error('Unexpected error during database query:', error);
    throw error;
  }
};

export const fetchAllAnalysis = async () => {
  try {
    const databaseConnection = await db; // Ensure database connection is established
    if (!databaseConnection) {
      throw new Error('Database connection failed.');
    }

    return new Promise((resolve, reject) => {
      databaseConnection.transaction(tx => {
        tx.executeSql(
          `SELECT a.*, b.* FROM analysis a INNER JOIN bed b ON a.bedId = b.bedId ORDER BY timestamp DESC;`,
          [],
          (_, result) => {

            if (result?.rows?.length) {
              const rowsArray = [];
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                rowsArray.push(row);
              }
              resolve(rowsArray);
            } else {
              console.log('No data found in analysis table.');
              resolve([]); 
            }
          },
          error => {
            console.error('Query error:', error);
            reject(error); 
          }
        );
      });
    });
  } catch (error) {
    console.error('Unexpected error during database query:', error);
    throw error;
  }
};

export const fetchAnalysisByBedId = async bedId => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM analysis WHERE bedId = ?`,
          [bedId],
          (_, result) => {
            console.log('Number of rows fetched by bedId query:', result.rows.length);

            if (result?.rows?.length) {
              const analysisArray = [];
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                console.log('Fetched analysis row:', row);
                analysisArray.push(row);
              }

              console.log('Analysis array after iteration:', analysisArray);
              resolve(analysisArray);
            } else {
              console.log('No rows found for given bedId.');
              resolve([]); 
            }
          },
          error => {
            console.error('Query error:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Unexpected error during fetchAnalysisByBedId query:', error);
    throw error;
  }
};

export const getLatestAnalysisByBedId = async (bedId) => {
  try {
    const databaseConnection = await db;
    if (!databaseConnection) {
      throw new Error('Database connection failed.');
    }

    return new Promise((resolve, reject) => {
      databaseConnection.transaction(tx => {
        tx.executeSql(
          `
          SELECT a.*, b.*
          FROM analysis a
          INNER JOIN bed b ON a.bedId = b.bedId
          WHERE a.bedId = ? AND a.timestamp = (
            SELECT MAX(sub.timestamp)
            FROM analysis sub
            WHERE sub.bedId = ?
          )
          LIMIT 1;
          `,
          [bedId, bedId],
          (_, result) => {
            if (result?.rows?.length) {
              const latest = result.rows.item(0);
              resolve(latest);
            } else {
              console.log('No analysis found for bedId:', bedId);
              resolve(null);
            }
          },
          error => {
            console.error('Query error:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Unexpected error during query:', error);
    throw error;
  }
};


// export const getLatestAnalysisByBedId = async bedId => {
//   try {
//     return new Promise((resolve, reject) => {
//       db.transaction(tx => {
//         tx.executeSql(
//           `SELECT * FROM analysis WHERE bedId = ? ORDER BY createdAt DESC LIMIT 1`, // Change this line based on your schema
//           [bedId],
//           (_, result) => {
//             console.log('Number of rows fetched for latest analysis:', result.rows.length);

//             if (result?.rows?.length) {
//               const latestAnalysis = result.rows.item(0);
//               console.log('Latest analysis row:', latestAnalysis);
//               resolve(latestAnalysis);
//             } else {
//               console.log('No analysis found for the given bedId.');
//               resolve(null);
//             }
//           },
//           error => {
//             console.error('Query error:', error);
//             reject(error);
//           }
//         );
//       });
//     });
//   } catch (error) {
//     console.error('Unexpected error during getLatestAnalysisByBedId:', error);
//     throw error;
//   }
// };

// export default db;
