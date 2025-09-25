# JangbiGO Backend

A robust Node.js backend API built with Express.js, TypeScript, PostgreSQL, Prisma ORM, and Kakao OAuth authentication.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe JavaScript development
- **PostgreSQL** - Relational database with Prisma ORM
- **Yup Validation** - Schema-based request validation
- **Input Validation** - Comprehensive request validation using Yup
- **Security Middleware** - Helmet, CORS, rate limiting
- **Swagger Documentation** - Interactive API documentation
- **Code Quality** - ESLint configuration with TypeScript support
- **Environment Configuration** - Environment-based configuration
- **Logging** - Structured logging utility
- **Database Management** - Prisma ORM with connection pooling

## 📁 Project Structure

```
JangbiGO-backend/
├── src/
│   ├── config/             # Configuration files
│   │   ├── database.ts     # PostgreSQL connection management
│   │   └── swagger.ts      # Swagger documentation config
│   ├── lib/                # Library files
│   │   └── prisma.ts       # Prisma client instance (shared)
│   ├── middleware/         # Custom middleware
│   │   └── notFound.ts     # 404 handler
│   ├── models/             # Data models (if needed)
│   ├── prisma/             # Prisma schema and migrations
│   │   └── schema.prisma   # Database schema
│   ├── routes/             # API routes
│   │   └── health.ts       # Health check route
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts        # Type definitions
│   ├── utils/              # Utility functions
│   │   ├── logger.ts       # Logging utility
│   └── app.ts              # Main application file
├── .env.example            # Environment variables template
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Git ignore rules
├── jest.config.js         # Jest testing configuration
├── nodemon.json           # Nodemon configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd JangbiGO-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration values.

4. **Set up PostgreSQL**

   - Install PostgreSQL locally or use a cloud service
   - Create a database named `jangbigo_db`
   - Update `DATABASE_URL` in your `.env` file

5. **Set up Prisma**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database (for development)
   npm run db:push

   # Or run migrations (for production)
   npm run db:migrate
   ```


6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📋 Available Scripts

- `npm start` - Start production server (requires build)
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database (development)
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# PostgreSQL Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/jangbigo_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Logging
LOG_LEVEL=info
```

## 🚀 Deployment

### Production Setup

1. Set `NODE_ENV=production`
2. Configure environment variables
3. Set up a production PostgreSQL instance
4. Build the TypeScript code:
   ```bash
   npm run build
   ```
5. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/app.js --name "jangbigo-backend"
   ```

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

The project includes Jest configuration for testing:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Run tests: `npm test`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.
