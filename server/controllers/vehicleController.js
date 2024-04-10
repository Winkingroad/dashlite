const Vehicle = require('../models/vehicle');

exports.getReport = async (req, res) => {
  try {
    const { reportType, frequency, startDate, endDate, type, make } = req.query;

    // Validate input parameters
    if (!reportType || !frequency || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Validate date format
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Please use DD_MM_YYYY' });
    }

    // Get the minimum and maximum dates from the database
    const dateRange = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          minDate: { $min: '$date' },
          maxDate: { $max: '$date' },
        },
      },
    ]);

    if (dateRange.length > 0) {
      const { minDate, maxDate } = dateRange[0];
      console.log('Minimum date:', minDate);
      console.log('Maximum date:', maxDate);
      console.log('Start date:', startDateObj.toISOString());
      if (startDateObj > new Date(maxDate)){
        return res.status(400).json({ error: 'Date range is out of bounds. Please select a correct time period.' });
      }
      if (startDateObj > endDateObj){
        return res.status(400).json({ error: 'Date range is out of bounds. Please select a correct time period. Start date is greater than End date' });
      }
    }

    let pipeline = [];

    // Match vehicles based on date range
    pipeline.push({
      $match: {
        date: {
          $gte: startDateObj,
          $lte: endDateObj,
        },
      },
    });

    // Additional match for type and make (if provided)
    if (type) {
      pipeline.push({ $match: { type: type } });
    }
    if (make) {
      pipeline.push({ $match: { make: make } });
    }

    // Grouping based on frequency
    let groupBy = {
      _id: {},
      totalMilesDriven: { $sum: '$milesDriven' },
      make: { $push: '$make' },
      licensePlates: { $push: '$licensePlate' },
      types: { $push: '$type' },
      dates: { $push: '$date' },
      VINs: { $push: '$VIN' },
      models: { $push: '$model' },
    };

    switch (frequency) {
      case 'daily':
        groupBy._id = { $dateToString: { format: '%d_%m_%Y', date: '$date' } };
        break;
      case 'weekly':
        groupBy._id = { $week: '$date' };
        break;
      case 'monthly':
        groupBy._id = { $month: '$date' };
        break;
      case 'yearly':
        groupBy._id = { $year: '$date' };
        break;
      default:
        break;
    }

    pipeline.push({ $group: groupBy });

    //additional $match stage for date range
    pipeline.unshift({
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    });

    const result = await Vehicle.aggregate(pipeline);
    
    console.log(result.length)
    if (result.length === 0) {
      return res.status(404).json({ message: 'No data found for this time period' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Error fetching report' });
  }
};
