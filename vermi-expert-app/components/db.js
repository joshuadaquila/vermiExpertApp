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
        `CREATE TABLE IF NOT EXISTS plant (
          plantId INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT, 
          category TEXT,
          description TEXT
        )`,
        [],
        () => {
          console.log('Plant table created successfully');
        },
        error => {
          console.error('Error creating Plant table:', error);
        }
      );

      
      // Create the analysis table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS analysis (
          analysisId INTEGER PRIMARY KEY AUTOINCREMENT,
          plantId INTEGER,
          light REAL,
          temperature REAL,
          recommendations TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (plantId) REFERENCES plant (plantId)
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


// Insert a sample row into the analysis table
const defaultPlants = [
  {
    name: "Peace Lily (Spathiphyllum)",
    category: "Temperature: 18-27°C, Light: 296-874 lux",
    description: "Thrives in low shaded area. These lovely plants not only brighten up a living space, but are also excellent at cleaning the air of the room they are in"
  },
  {
    name: "Boston Fern (Nephrolepis exaltata)",
    category: "Temperature: 18-27°C, Light: 652-870 lux",
    description: "Prefers moderate light conditions. Apart from enhancing the aesthetics, they are also useful in removing harmful air pollutants from the environment"
  },
  {
    name: "ZZ Plant (Zamioculcas zamiifolia)",
    category: "Temperature: 20-25°C, Light: 4348-13043 lux",
    description: "Can tolerate low light and neglect. It can be used as an ornamental plant and to improve indoor air quality"
  },
  {
    name: "Rubber Plant (Ficus elastica)",
    category: "Temperature: 20-30°C, Light: 8739-12696 lux",
    description: "Requires bright, indirect light. Because of the large surface area, it's perfect for purifying the air. Proper rubber plant care is thought to produce plants that pick up pollutants and chemicals, absorb them and turn them into harmless compounds."
  },
  {
    name: "Spider Plant (Chlorophytum comosum)",
    category: "Temperature: 20-25°C, Light: 4348-13043 lux",
    description: "Easy to care for and thrives in various light conditions. Spider plant helps clean indoor air. Studies have shown that spider plant is quite effective in cleaning indoor air by absorbing chemicals including formaldehyde, xylene, benzene, and carbon monoxide in homes or offices. Thick, fleshy roots allow spider plant to tolerate inconsistent watering."
  },
  {
    name: "Dieffenbachia (Dieffenbachia spp.)",
    category: "Temperature: 20-25°C, Light: 2174-13043 lux",
    description: "Prefers indirect light and moderate humidity. Gardeners prize this houseplant for its variegated leaves, not flowers, and also for its ability to purify indoor air"
  },
  {
    name: "Chinese Evergreen (Aglaonema)",
    category: "Temperature: 20-30°C, Light: 2174-13043 lux",
    description: "Adaptable to low light conditions. It's considered one of the best foliage plants for cleansing room air of toxins such as benzene and formaldehyde"
  },
  {
    name: "Fiddle Leaf Fig (Ficus lyrata)",
    category: "Temperature: 20-30°C, Light: 4348-13043 lux",
    description: "Needs bright, indirect light to thrive. It can improve indoor air quality, enhance the look of a space, and promote mental and physical well-being"
  }
];

export const insertDefaultPlants = async () => {
  try {
    const database = await db; // Ensure the database connection
    database.transaction(tx => {
      // Loop through default plants and insert them into the database
      defaultPlants.forEach(plant => {
        tx.executeSql(
          `SELECT * FROM plant WHERE name = ?`,
          [plant.name],
          (_, result) => {
            if (result?.rows?.length) {
              console.log(`Plant ${plant.name} already exists.`);
            } else {
              // Insert new plant into the database if it doesn't exist
              tx.executeSql(
                `INSERT INTO plant (name, category, description)
                 VALUES (?, ?, ?)`,
                [plant.name, plant.category, plant.description],
                () => {
                  console.log(`${plant.name} inserted into the plant table.`);
                },
                error => {
                  console.error(`Error inserting ${plant.name} into the plant table:`, error);
                }
              );
            }
          },
          error => {
            console.error('Error querying plant table:', error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Unexpected error during default plant insertion:', error);
  }
};

// Function to fetch all beds from the bed table
export const fetchPlants = async () => {
  const database = await db;
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM plant`,
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


export const fetchPlantsInfo = async (plantId) => {
  const database = await db;
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM plant WHERE plantId = ?`,
        [plantId],
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

export const insertAnalysis = async (data) => {
  console.log("data received", data)
  try {
    const database = await db; // Ensure the database connection
    database.transaction(tx => {
      // Query to find the corresponding bedId
      // Insert analysis only if the bedId is valid
      tx.executeSql(
        `INSERT INTO analysis (plantId, light, temperature, recommendations)
          VALUES (?, ?, ?, ?)`,
        [data.plantId, data.light, data.temperature, data.recommendations],
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


export const fetchFavorites = async () => {
  const database = await db;
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM favorites`,
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
          `SELECT a.*, p.* FROM analysis a INNER JOIN plant p ON a.plantId = p.plantId ORDER BY timestamp DESC;`,
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


export default db;
