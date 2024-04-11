import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState('totalMilesDriven');
  const [frequency, setFrequency] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [make, setMake] = useState('');
  const [type, setType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState('');

  const fetchReport = () => {
    if (!startDate || !endDate) {
      setError('Please provide start and end dates');
      return;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      setError('Invalid date format. Please use DD_MM_YYYY');
      return;
    }

    setError('');

    const backendUrl = process.env.REACT_APP_BACKEND_URI;
    const url = `${backendUrl}/reports?reportType=${reportType}&frequency=${frequency}&startDate=${startDate}&endDate=${endDate}&make=${make}&type=${type}`;
    console.log(url);
 fetch(url)
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          if (response.status === 404) {
            // No data found
            setReportData([]);
            setError('No data found for this time period');
          } else {
            // Other errors
            setError(data.error);
          }
          throw new Error(data.error);
        });
      }
      return response.json();
    })
    .then(data => {
      // If response is successful, update report data
      setReportData(data);
      setError('');
    })
    .catch(error => {
      console.error('Error fetching report:', error);
    });
};

  useEffect(() => {
    fetchReport();
  }, [currentPage , frequency,make,reportType,startDate,endDate,type]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <>
      <h1 className="text-3xl font-bold py-5 text-center text-white relative z-10 bg-gray-900">
        Vehicle Reports
      </h1>
      <div className="bg-gray-900 p-9 rounded-lg shadow-lg flex flex-col">
        <div className="absolute bg-gradient-to-br from-blue-800 to-gray-900 opacity-30 z-0"></div>
        <div className="flex items-center justify-center mb-6 relative z-10 flex-col">
          <label htmlFor="reportType" className="mr-6 mb-4 text-gray-400">
            Report Type
          </label>
          <select
            id="reportType"
            className="mr-6 mb-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-md shadow-sm"
            value={reportType}
            onChange={e => setReportType(e.target.value)}
          >
            <option value="totalMilesDriven">Total Miles Driven</option>
            {/* Add more options for different report types if needed */}
          </select>
          <label htmlFor="frequency" className="mr-6 mb-4 text-gray-400">
            Frequency
          </label>
          <select
            id="frequency"
            className="mr-6 mb-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-md shadow-sm"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <div className="flex items-center mb-4">
            <label htmlFor="startDate" className="mr-6 mb-3 text-gray-400">
              Start
            </label>
            <input
              type="date"
              id="startDate"
              className="mr-6 px-4 py-2 bg-gray-800 text-gray-300 rounded-md shadow-sm"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <label htmlFor="endDate" className="mr-6 mb-3 text-gray-400">
              End
            </label>
            <input
              type="date"
              id="endDate"
              className="mr-6 px-4 py-2 bg-gray-800 text-gray-300 rounded-md shadow-sm"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <label htmlFor="make" className="mr-6 mb-4 text-gray-400">
            Make
          </label>
          <input
            type="text"
            id="make"
            className="mr-6 mb-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-md shadow-sm"
            value={make}
            onChange={e => setMake(e.target.value)}
          />
          <label htmlFor="type" className="mr-6 mb-4 text-gray-400">
            Type
          </label>
          <input
            type="text"
            id="type"
            className="mr-4 mb-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-md shadow-sm"
            value={type}
            onChange={e => setType(e.target.value)}
          />
          {error && (
            <div className="text-red-500 mb-4 relative z-10">{error}</div>
          )}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md relative z-10"
            onClick={fetchReport}
          >
            Generate Report
          </button>
        </div>

        <div
          id="reportResult"
          className="relative z-10 flex-1 overflow-y-auto mr-14 mt-14"
        >
          <h2 className="text-xl font-bold mb-4 text-white text-center">
            Report Results
          </h2>
          <table className="table-auto border-collapse border border-gray-700 w-full bg-gray-800 rounded-md shadow-md">
            <thead>
              <tr>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">
                  Total Miles Driven
                </th>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">
                  Date
                </th>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">
                  Make
                </th>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">
                  License Plate
                </th>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">
                  Model
                </th>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">
                  Type
                </th>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">
                  VIN
                </th>
              </tr>
            </thead>
            <tbody>
  {reportData.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center text-gray-300 py-4">
        No data found for this time period
      </td>
    </tr>
  ) : (
    currentItems.map((item, index) => (
      <tr key={index} className="hover:bg-gray-700">
        <td className="border border-gray-700 px-4 py-2 text-gray-300">
          {item.totalMilesDriven}
        </td>
        <td className="border border-gray-700 px-4 py-2 text-gray-300">
          {item.dates.map(date => (
            <div>
              {new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          ))}
        </td>
        <td className="border border-gray-700 px-4 py-2 text-gray-300">
          {item.make.map(make => <div>{make}</div>)}
        </td>
        <td className="border border-gray-700 px-4 py-2 text-gray-300">
          {item.licensePlates.map(plate => <div>{plate}</div>)}
        </td>
        <td className="border border-gray-700 px-4 py-2 text-gray-300">
          {item.models.map(model => <div>{model}</div>)}
        </td>
        <td className="border border-gray-700 px-4 py-2 text-gray-300">
          {item.types.map(type => <div>{type}</div>)}
        </td>
        <td className="border border-gray-700 px-4 py-2 text-gray-300">
          {item.VINs.map(VIN => <div>{VIN}</div>)}
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
          {/* Pagination */}
          <div className="mt-4 flex justify-center relative z-10">
            {reportData.length > itemsPerPage && (
              <ul className="flex pl-0 list-none rounded my-2">
                {Array(Math.ceil(reportData.length / itemsPerPage))
                  .fill()
                  .map((_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`${
                          currentPage === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        } px-3 py-1 font-semibold mx-1 rounded-md shadow-sm`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;