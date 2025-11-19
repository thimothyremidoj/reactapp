# Quick Setup Guide

## Database Setup

1. **Install MySQL 8.0+** on your system

2. **Start MySQL service**

3. **Update credentials** in `todo/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

4. **Run the application** - Database and tables will be created automatically:
   ```bash
   cd todo
   ./mvnw spring-boot:run
   ```

## Default Users

The application automatically creates:
- **Admin**: username=`admin`, password=`admin123`
- **User**: username=`user`, password=`user123`

## Access Points

- **Frontend**: http://localhost:3000 (if running React dev server)
- **Backend API**: http://localhost:8080/api
- **Swagger Docs**: http://localhost:8080/api/swagger-ui.html

## Docker Setup (Alternative)

```bash
docker-compose up --build
```
Access at: http://localhost