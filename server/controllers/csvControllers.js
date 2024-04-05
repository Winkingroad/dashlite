const fs = require('fs');
const csv = require('csv-parser');
const Vehicle = require('../models/vehicle');

exports.uploadCSV = async (req, res) => {
  const filePath = './sample_electric_vehicle_data.csv'; // Provide the path to your folder containing CSV files

  // Read the CSV file
  const stream = fs.createReadStream(filePath);

  stream.on('error', (err) => {
    console.error('Error reading CSV file:', err);
    res.status(500).json({ error: 'Error reading CSV file' });
  });

  stream.pipe(csv())
    .on('data', async (row) => {
      // Create a new vehicle object for each row
      const vehicle = new Vehicle({
        licensePlate: row['License Plate'],
        make: row['Make'],
        VIN: row['VIN'],
        model: row['Model'],
        type: row['Type'],
        date: row['Date'],
        milesDriven: row['Miles Driven']
      });

      try {
        // Save the vehicle to the database
        const savedVehicle = await vehicle.save();
        console.log('Vehicle saved:', savedVehicle);
      } catch (error) {
        console.error('Error saving vehicle:', error);
      }
    })
    .on('end', () => {
      console.log(`CSV file "${filePath}" successfully processed`);
      res.status(200).json({ message: 'CSV files successfully processed' });
    });
};
