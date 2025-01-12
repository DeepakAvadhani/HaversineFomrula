# Simple Server

A simple server built using [Express.js](https://expressjs.com/) that provides a single endpoint to check if given coordinates are within a predefined zone and calculates the distance.

## Features

- Lightweight and easy to use
- Single RESTful API endpoint
- Calculates distance and checks if coordinates fall within a specific zone

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14.x or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/simple-server.git
cd simple-server
```

### Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### Run the Server

Using npm:

```bash
npm start
```

Or using yarn:

```bash
yarn start
```

The server will start running on `http://localhost:3000` by default.

## API Endpoint

### Base URL

```
http://localhost:3000
```

### Endpoint Details

#### `POST /api/check-location`

**Description:**
Takes an array of points (latitude and longitude) as input and checks if the coordinates are within a predefined zone. It also calculates the distance from the center of the zone.

**Request Body:**

```json
{
  "points": [
    {"lat": 13.257508013855803, "lon": 77.56957059803679}
  ]
}
```

**Response:**

```json
[
  {
    "point_name": "point_77.56957059803679_13.257508013855803",
    "distance": 17.99,
    "is_within_zone": false
  }
]
```

- `point_name`: Identifier for the point based on its coordinates.
- `distance`: Distance (in kilometers) from the center of the zone.
- `is_within_zone`: Boolean indicating if the coordinates are within the zone.

## Project Structure

```
.
├── package.json       # Project metadata and dependencies
├── index.js          # Main server file 
└── README.md          # Documentation for the project
```

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

