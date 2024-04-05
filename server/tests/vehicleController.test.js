const request = require('supertest');
const {app} = require('../app');
const Vehicle = require('../models/vehicle');

describe('GET /reports', () => {
  it('should return status 200 and report data for valid request', async () => {
    const mockReportData = [
      {
        _id: { date: '2024-01-01' },
        totalMilesDriven: 100,
        make: ['Toyota'],
        licensePlates: ['ABC123'],
        types: ['Sedan']
      },
      {
        _id: { date: '2024-01-02' },
        totalMilesDriven: 150,
        make: ['Honda'],
        licensePlates: ['XYZ456'],
        types: ['SUV']
      }
    ];

    jest.spyOn(Vehicle, 'aggregate').mockResolvedValue(mockReportData);

    const response = await request(app)
      .get('/reports')
      .query({
        reportType: 'totalMilesDriven',
        frequency: 'daily',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        type: 'SUV',
        make: 'Honda'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReportData);
  });

  it('should return status 500 for invalid request', async () => {
    jest.spyOn(Vehicle, 'aggregate').mockRejectedValue(new Error('Mock Error'));

    const response = await request(app)
      .get('/reports')
      .query({
        reportType: 'invalidType', // Invalid reportType
        frequency: 'daily',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        type: 'SUV',
        make: 'Honda'
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error fetching report' });
  });
});
