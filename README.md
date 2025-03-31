# SensaReal Backend

Backend service for the SensaReal IoT Sensor Monitoring System. This service provides a RESTful API for managing sensor data, user authentication, and alert configurations.

## Features

- 🔐 JWT-based authentication
- 📊 Sensor data management
- ⚡ Real-time alerts
- 📝 Swagger API documentation
- 🔄 Database migrations and seeding
- 📝 Comprehensive logging with Pino
- 🛡️ Security features (Helmet, CORS, Input validation)

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- Docker and Docker Compose (for local development)
- npm

## Installation

1. Clone the repository:

```bash
git clone https://github.com/lgonzalezrouco/sensareal-backend.git
cd sensareal-backend
```

2. Set up environment variables:

```bash
cp .env.template .env
```

Edit the `.env` file with your configuration:

3. Set up a mailtrap account and add the credentials to the `.env` file

4. Make the initial setup:

```bash
make setup
```

## Development

Start the development server:

```bash
make dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Documentation

Once the server is running, you can access the Swagger API documentation at:

```bash
http://localhost:3000/api-docs
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo the last migration
- `npm run db:seed` - Seed the database
- `npm run db:seed:undo` - Undo database seeding

## Project Structure

```bash
sensareal-backend/
├── config/             # Configuration files
├── migrations/         # Database migrations
├── models/            # Sequelize models
├── routes/            # API routes
├── seeders/           # Database seeders
├── src/               # Source code
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── services/      # Business logic
│   └── utils/         # Utility functions
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
├── app.js            # Application entry point
└── package.json      # Project dependencies
```

## Database

The project uses MySQL with Sequelize ORM. The database configuration is managed through environment variables and the `config/database.js` file.

### Database Setup

1. The database is automatically created when running migrations
2. Initial data is seeded using the seeders
3. Default admin user credentials:
   - Email: <admin@sensareal.com>
   - Password: admin123

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS enabled
- Helmet security headers
- Rate limiting (configurable)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
