# PostgreSQL Deployment Guide for Squadbox SSH Server

## Database Configuration
- **Database Name**: `gdiba2_squadbox`
- **Username**: `gdiba-2tb-hostingcom`
- **Password**: `xuPxu7-buwxaq-kemryf`
- **Host**: `postgres` (Docker container)
- **Port**: `5432` (Docker), `5435` (Local development)

## PostgreSQL Service Configuration

### Docker Compose Setup
The PostgreSQL service is configured in `docker-compose.ssh.yml`:

```yaml
postgres:
  image: postgres:15-alpine
  environment:
    - POSTGRES_DB=gdiba2_squadbox
    - POSTGRES_USER=gdiba-2tb-hostingcom
    - POSTGRES_PASSWORD=xuPxu7-buwxaq-kemryf
    - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./backend/init.sql:/docker-entrypoint-initdb.d/init.sql
  restart: unless-stopped
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U gdiba-2tb-hostingcom -d gdiba2_squadbox"]
    interval: 10s
    timeout: 5s
    retries: 5
```

### Database Initialization
The database is automatically initialized with `backend/init.sql` which creates:

1. **Tables**:
   - `users` - User accounts and authentication
   - `projects` - Project metadata and status
   - `project_files` - Individual file tracking
   - `templates` - Available project templates
   - `user_sessions` - Session management

2. **Indexes**:
   - Performance indexes on frequently queried columns
   - Foreign key indexes for joins
   - Composite indexes for complex queries

3. **Triggers**:
   - Automatic `updated_at` timestamp updates
   - Data validation triggers

4. **Views**:
   - `user_project_summary` - User statistics
   - `project_details` - Enhanced project information

5. **Default Data**:
   - 11 project templates
   - Admin user account
   - System initialization log

## Backend Configuration

### Environment Variables
```bash
DATABASE_URL=postgresql://gdiba-2tb-hostingcom:xuPxu7-buwxaq-kemryf@postgres:5432/gdiba2_squadbox
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=gdiba2_squadbox
POSTGRES_USER=gdiba-2tb-hostingcom
POSTGRES_PASSWORD=xuPxu7-buwxaq-kemryf
```

### Connection String Format
```
postgresql://username:password@host:port/database
postgresql://gdiba-2tb-hostingcom:xuPxu7-buwxaq-kemryf@postgres:5432/gdiba2_squadbox
```

## Deployment Steps

### 1. Start PostgreSQL Service
```bash
# Start only PostgreSQL service
docker-compose up -d postgres

# Check PostgreSQL status
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs -f postgres
```

### 2. Verify Database Connection
```bash
# Connect to PostgreSQL container
docker-compose exec postgres psql -U gdiba-2tb-hostingcom -d gdiba2_squadbox

# Test connection from backend
docker-compose exec backend python -c "
import psycopg2
conn = psycopg2.connect(
    host='postgres',
    port=5432,
    database='gdiba2_squadbox',
    user='gdiba-2tb-hostingcom',
    password='xuPxu7-buwxaq-kemryf'
)
print('✅ PostgreSQL connection successful')
conn.close()
"
```

### 3. Check Database Initialization
```sql
-- Connect to database
\c gdiba2_squadbox

-- Check tables
\dt

-- Check templates
SELECT id, name, category FROM templates;

-- Check users
SELECT id, email, subscription_type FROM users;

-- Check database size
SELECT pg_size_pretty(pg_database_size('gdiba2_squadbox'));
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    subscription_type VARCHAR(50) DEFAULT 'beta',
    subscription_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

### Projects Table
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    file_count INTEGER DEFAULT 0,
    zip_size BIGINT DEFAULT 0,
    has_zip BOOLEAN DEFAULT false,
    download_url VARCHAR(500),
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_time TIMESTAMP,
    build_log TEXT,
    error_log TEXT,
    requirements TEXT,
    generated_files JSONB,
    metadata JSONB
);
```

## Monitoring and Maintenance

### Health Checks
```bash
# Check PostgreSQL health
docker-compose exec postgres pg_isready -U gdiba-2tb-hostingcom -d gdiba2_squadbox

# Check database connections
docker-compose exec postgres psql -U gdiba-2tb-hostingcom -d gdiba2_squadbox -c "SELECT count(*) FROM pg_stat_activity;"
```

### Backup and Restore
```bash
# Backup database
docker-compose exec postgres pg_dump -U gdiba-2tb-hostingcom gdiba2_squadbox > backup.sql

# Restore database
docker-compose exec -T postgres psql -U gdiba-2tb-hostingcom gdiba2_squadbox < backup.sql
```

### Performance Monitoring
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('gdiba2_squadbox'));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check active connections
SELECT count(*) as active_connections FROM pg_stat_activity;
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   
   # Restart PostgreSQL
   docker-compose restart postgres
   ```

2. **Authentication Failed**
   ```bash
   # Verify credentials in docker-compose.yml
   # Check environment variables
   docker-compose exec postgres psql -U gdiba-2tb-hostingcom -d gdiba2_squadbox
   ```

3. **Database Not Found**
   ```bash
   # Check if database exists
   docker-compose exec postgres psql -U gdiba-2tb-hostingcom -l
   
   # Create database if needed
   docker-compose exec postgres createdb -U gdiba-2tb-hostingcom gdiba2_squadbox
   ```

4. **Permission Denied**
   ```bash
   # Check user permissions
   docker-compose exec postgres psql -U gdiba-2tb-hostingcom -d gdiba2_squadbox -c "\du"
   
   # Grant permissions
   docker-compose exec postgres psql -U gdiba-2tb-hostingcom -d gdiba2_squadbox -c "GRANT ALL PRIVILEGES ON DATABASE gdiba2_squadbox TO gdiba-2tb-hostingcom;"
   ```

## Security Considerations

1. **Password Security**: The password `xuPxu7-buwxaq-kemryf` should be changed in production
2. **Network Security**: PostgreSQL is only accessible within Docker network
3. **Data Encryption**: Consider enabling SSL/TLS for production
4. **Backup Strategy**: Implement regular automated backups
5. **Access Control**: Limit database access to application containers only

## Production Recommendations

1. **Change Default Password**: Use a strong, unique password
2. **Enable SSL**: Configure SSL certificates for encrypted connections
3. **Regular Backups**: Set up automated daily backups
4. **Monitoring**: Implement database monitoring and alerting
5. **Performance Tuning**: Optimize PostgreSQL configuration for production workload
6. **Security Updates**: Keep PostgreSQL updated with latest security patches

## Connection Examples

### Python (psycopg2)
```python
import psycopg2

conn = psycopg2.connect(
    host='postgres',
    port=5432,
    database='gdiba2_squadbox',
    user='gdiba-2tb-hostingcom',
    password='xuPxu7-buwxaq-kemryf'
)
```

### Node.js (pg)
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'postgres',
  port: 5432,
  database: 'gdiba2_squadbox',
  user: 'gdiba-2tb-hostingcom',
  password: 'xuPxu7-buwxaq-kemryf'
});
```

### Connection URL
```
postgresql://gdiba-2tb-hostingcom:xuPxu7-buwxaq-kemryf@postgres:5432/gdiba2_squadbox
```

---

**Status**: ✅ PostgreSQL configuration complete and ready for deployment
**Database**: `gdiba2_squadbox` 
**Server**: `gdiba2.ssh.tb-hosting.com`
**Deployment**: Docker Compose with persistent volumes
