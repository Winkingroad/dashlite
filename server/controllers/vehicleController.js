const Vehicle = require('../models/vehicle');

exports.getReport = async (req, res) => {
  try {
    const { reportType, frequency, startDate, endDate, type, make } = req.query;

    let pipeline = [];

    // Match vehicles based on date range
    pipeline.push({
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    });

    // Additional match for type and make (if provided)
    if (type) {
      pipeline.push({
        $match: {
          type: type
        }
      });
    }
    if (make) {
      pipeline.push({
        $match: {
          make: make
        }
      });
    }

    // Grouping based on frequency
    let groupBy = {
      _id: {},
      totalMilesDriven: { $sum: "$milesDriven" },
      make: { $push: "$make" },
      licensePlates: { $push: "$licensePlate" },
      types: { $push: "$type" }
    };

    switch (frequency) {
      case "daily":
        groupBy._id = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        break;
      case "weekly":
        groupBy._id = { $week: "$date" };
        break;
      case "monthly":
        groupBy._id = { $month: "$date" };
        break;
      case "yearly":
        groupBy._id = { $year: "$date" };
        break;
      default:
        break;
    }

    pipeline.push({ $group: groupBy });

    // Execute the aggregation pipeline
    const result = await Vehicle.aggregate(pipeline);

    res.json(result);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Error fetching report' });
  }
};
