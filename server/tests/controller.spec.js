const { expect } = require('chai');
const sinon = require('sinon');
const { app } = require('../app');
const request = require('supertest');

describe('Vehicle Controller', () => {
  describe('GET /reports', () => {
    it('should return a list of vehicle reports', (done) => {
      request(app)
        .get('/reports')
        .query({ reportType: 'totalMilesDriven', frequency: 'daily', startDate: '01-01-2023', endDate: '01-02-2023' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          // Add more assertions based on the expected response structure
          done();
        });
    });

    it('should return 400 if missing required parameters', (done) => {
      request(app)
        .get('/reports')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.equals('Missing required parameters');
          done();
        });
    });

    // Test case for invalid date format
    it('should return 400 if invalid date format', (done) => {
      request(app)
        .get('/reports')
        .query({ reportType: 'totalMilesDriven', frequency: 'daily', startDate: 'invalid', endDate: 'invalid' })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.equals('Invalid date format. Please use DD_MM_YYYY');
          done();
        });
    });

    // Test case for date range out of bounds
    it('should return 400 if date range out of bounds', async () => {
      // Assuming there's at least one record in the database
      const vehicle = await Vehicle.findOne(); // Find one vehicle record
      const maxDate = new Date(vehicle.date);
      maxDate.setDate(maxDate.getDate() - 1); // Subtract one day from max date
      request(app)
        .get('/reports')
        .query({ reportType: 'totalMilesDriven', frequency: 'daily', startDate: maxDate.toISOString(), endDate: vehicle.date })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.equals('Date range is out of bounds. Please select a correct time period.');
          done();
        });
    });

    // Test case for no data found for the specified time period
    it('should return 404 if no data found', (done) => {
      request(app)
        .get('/reports')
        .query({ reportType: 'totalMilesDriven', frequency: 'daily', startDate: '2025-01-01', endDate: '2025-01-07' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message').that.equals('No data found for this time period');
          done();
        });
    });
  });
});
