# Advanced To-Do App with Calendar & Reminders

A full-stack web application for personal productivity management with task management, calendar integration, and automated reminders.

**Deployed on Render.com**

## Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Spring Boot (Java 17+) with RESTful APIs
- **Database**: MySQL with JPA/Hibernate
- **Authentication**: JWT-based stateless authentication
- **Deployment**: Docker containerized setup

## Features

### User Features
- User registration and authentication
- Task management (create, update, delete, archive)
- Task status tracking (Pending, In Progress, Completed)
- Task prioritization (Low, Medium, High)
- Interactive calendar view with task visualization
- Task search and filtering capabilities
- Automated reminders for overdue tasks
- User profile management with secure password change

### Admin Features
- User account management
- System activity monitoring
- Role-based access control

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `PUT /api/tasks/{id}/status` - Update task status
- `DELETE /api/tasks/{id}` - Delete task
- `PUT /api/tasks/{id}/archive` - Archive task
- `GET /api/tasks/search` - Search tasks
- `GET /api/tasks/status/{status}` - Filter by status
- `GET /api/tasks/priority/{priority}` - Filter by priority
- `GET /api/tasks/calendar` - Get tasks by date range
- `GET /api/tasks/overdue` - Get overdue tasks

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/me/password` - Change password

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/users/{id}` - Get user by ID (Admin only)
- `DELETE /api/admin/users/{id}` - Delete user (Admin only)
- `PUT /api/admin/users/{id}/role` - Update user role (Admin only)

## Prerequisites

- Docker and Docker Compose
- Java 17+ (for local development)
- Node.js 18+ (for local development)
- MySQL 8.0+ (for local development)

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NewAdvancedToDo
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api
   - Swagger Documentation: http://localhost:8080/api/swagger-ui.html

4. **Default Admin Account**
   - Create an admin account by registering normally, then update the role in the database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';
   ```

## Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd todo
   ```

2. **Configure MySQL database**
   - Create database: `todoapp`
   - Update `application.properties` with your MySQL credentials

3. **Run the Spring Boot application**
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## Security Features

- **Password Encryption**: BCrypt hashing for secure password storage
- **JWT Authentication**: Stateless authentication with configurable expiration
- **Role-based Access Control**: USER and ADMIN roles with appropriate permissions
- **Input Validation**: Frontend and backend validation for all user inputs
- **CORS Configuration**: Properly configured for cross-origin requests
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries

## Performance Considerations

- **Database Indexing**: Optimized queries with proper indexing
- **Lazy Loading**: JPA lazy loading for related entities
- **Connection Pooling**: HikariCP for database connection management
- **Caching**: Browser caching for static assets
- **Minification**: Production build optimization for frontend

## API Documentation

The application includes Swagger/OpenAPI documentation available at:
- http://localhost:8080/api/swagger-ui.html (when running)

## Testing

### Backend Tests
```bash
cd todo
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Production Deployment

1. **Environment Variables**
   - Set production database credentials
   - Configure JWT secret key
   - Set appropriate CORS origins

2. **SSL/HTTPS**
   - Configure SSL certificates
   - Update security headers

3. **Database Migration**
   - Set `spring.jpa.hibernate.ddl-auto=validate` in production
   - Use proper database migration tools

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify MySQL is running
   - Check database credentials
   - Ensure database exists

2. **Port Conflicts**
   - Backend: Change port in `application.properties`
   - Frontend: Set PORT environment variable
   - MySQL: Update docker-compose.yml ports

3. **JWT Token Issues**
   - Check token expiration
   - Verify JWT secret configuration
   - Clear browser localStorage

### Logs

- Backend logs: Check Spring Boot console output
- Frontend logs: Check browser developer console
- Database logs: Check MySQL error logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.