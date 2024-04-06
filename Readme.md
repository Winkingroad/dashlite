# Vehicle Reports Dashboard

## Overview

The Vehicle Reports Dashboard is a web application built using React on the frontend and Express.js with MongoDB hosted on Azure Cosmos DB on the backend. It allows users to generate reports based on vehicle data stored in the Cosmos DB database and view the results in a tabular format. The application is deployed on Render, but it can also be hosted on Azure App Services.

## Features

- Generate reports based on various criteria such as report type, frequency, date range, make, and type.
- View report results paginated for better navigation.
- Accessible UI with responsive design.

## Tools and Techniques Used

- **Frontend**: React.js for building the user interface.
- **Backend**: Express.js for creating the RESTful API endpoints.
- **Database**: MongoDB hosted on Azure Cosmos DB for storing vehicle data.
- **Deployment**: Render for hosting the application, but it can also be deployed on Azure App Services.
- **Testing**: Jest and Supertest for unit testing backend routes.
- **Environment Variables**: Dotenv for managing environment variables.
- **Version Control**: Git for version control and GitHub for hosting the repository.

## Setup

### Prerequisites

- Node.js installed on your machine
- MongoDB installed and running locally or hosted on Azure Cosmos DB
- Azure account for deploying on Azure App Services (optional)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Winkingroad/dashlite.git
cd dashlite
npm install
cd client
npm install
```
## Setup

1. Create a `.env` file in the root directory and add the following environment variable:

MONGO_URI=<your MongoDB connection URI>


## Start the backend server

```bash
npm start
```
## Start the frontend development server

```bash
cd client
npm start
```

### Access the application in your browser at http://localhost:3001.

## Deployment
1.Render
2.Create an account on Render.
3.Connect your GitHub repository to Render.
4.Configure the deployment settings (build command, start command, etc.).
5.Deploy the application.
### OR
1.Azure App Services (Optional)
2.Create an account on Azure.
3.Create an Azure App Service for Node.js.
4.Configure deployment options to deploy the application from your GitHub repository.

## API Endpoints
1.GET /reports: Generate vehicle reports based on specified parameters.

#### Here's how the aggregation pipeline works for filtering:

1. **Match Vehicles Based on Date Range**: The first stage of the pipeline is a `$match` stage, which filters the documents based on the date range provided in the request query. It uses the `$gte` (greater than or equal) and `$lte` (less than or equal) operators to match documents with dates falling within the specified range.

2. **Additional Match for Type and Make (if provided)**: If the request includes parameters for vehicle type or make, additional `$match` stages are added to the pipeline to further filter the documents based on these criteria.

3. **Grouping Based on Frequency**: The next stage in the pipeline is a `$group` stage, which groups the filtered documents based on the specified frequency (daily, weekly, monthly, or yearly). The `_id` field in the groupBy object determines how the documents are grouped. Depending on the frequency, different date aggregation operators like `$dateToString`, `$week`, `$month`, or `$year` are used to extract the relevant information from the date field.

4. **Aggregation**: Within the `$group` stage, various aggregation operators are used to perform calculations on the grouped data. In this case, the `$sum` operator is used to calculate the total miles driven, while the `$push` operator is used to create arrays of distinct values for make, license plates, and types within each group.

5. **Execute the Aggregation Pipeline**: Finally, the aggregation pipeline is executed using the `Vehicle.aggregate()` method, which returns the aggregated results based on the specified pipeline stages.

6. **Response**: The aggregated results are then sent as a JSON response to the client.

## Testing

The project includes unit tests for backend routes using Jest and Supertest. To run the tests, use the following command:

```bash
npm test
```

Please replace `<your MongoDB connection URI>` with your actual MongoDB connection URI. Let me know if you need help with anything else!
