# Smart Transit AI - Database Operations Guide

This guide is intended for Database Administrators (DBAs) and Backend Engineers to understand the architecture, data structures, and operational procedures for the Smart Transit AI MongoDB database.

---

## 1. Database Architecture

The application uses **MongoDB** as its primary data store. We leverage **Mongoose**, an Object Data Modeling (ODM) library, to enforce schemas, handle validation, and manage relationships between collections.

### Core Collections

The database consists of four primary collections:

1.  **`users`**: Stores authentication credentials, profile information, and RBAC roles.
2.  **`projects`**: High-level containers for transit planning initiatives. Tied to specific geographical boundaries.
3.  **`scenarios`**: Specific configurations (bus counts, speed) run against a Project's boundary.
4.  **`results`**: Detailed output metrics and GeoJSON route generation data produced by the Machine Learning optimization engine.

---

## 2. Collection Schemas & Relationships

### Users (`users`)

- **Indexes**: `email` (Unique)
- **Security**: Passwords are automatically hashed using `bcryptjs` via Mongoose pre-save hooks.
- **Roles**: `admin`, `planner`, `viewer`.

### Projects (`projects`)

- **Fields**: `city_name`, `boundary_geojson`, `created_by` (ObjectId ref to `User`), timestamps.
- **Data Types**: `boundary_geojson` uses a nested schema to strictly enforce valid GeoJSON Polygon structures.

### Scenarios (`scenarios`)

- **Relationships**: Belongs to one `Project` (`project_id`).
- **Fields**: `num_buses`, `operating_hours`, `avg_speed`, `status` (`pending`, `processing`, `completed`, `failed`).
- **Lifecycle**: Status transitions are critical for tracking asynchronous ML workload states.

### Results (`results`)

- **Relationships**: Belongs to one `Scenario` (`scenario_id`).
- **Size Warning**: Contains potentially massive `FeatureCollection` GeoJSON objects (`stops`, `routes`).
- **Metrics**: Stores calculated KPIs (`coverage_percent`, allocation metrics).

---

## 3. Database Operations & Procedures

### Connection Management

- The connection logic resides in `server/src/config/db.js`.
- It connects using the `MONGODB_URL` defined in the `.env` file.
- The connection pool size is handled by MongoDB Node driver defaults but should be monitored under high ML load.

### Schema Modifications

- **Never modify schemas directly in the database.** All schema definitions must reside in `server/src/models/`.
- Mongoose is configured to use `timestamps: true` on all models to automatically track `createdAt` and `updatedAt`.

### Handling GeoJSON Data

Our system heavily relies on GeoJSON objects.

- Mongoose strictly validates `type` (e.g., 'Polygon', 'FeatureCollection') and `coordinates`.
- **Performance Tuning**: If geospatial queries (like `$geoIntersects` or `$near`) are introduced in the future, 2dsphere indexes _must_ be applied to the GeoJSON paths. Currently, we only store and retrieve this data.

### Query Strategy

The backend uses a standard Repository/Controller approach.

- **Pagination**: Large collections (like `projects`) are retrieved using `.skip()` and `.limit()` in the controllers.
- **Filtering**: By default, queries are scoped to the authenticated user (`{ created_by: req.user._id }`) to enforce tenant isolation.

---

## 4. Maintenance & Best Practices

1.  **Backups**: Implement automated daily backups of the production database using tools like `mongodump` or MongoDB Atlas automated snapshots.
2.  **Monitoring**: Monitor database size, slow queries, and memory usage. The `results` collection will grow significantly due to ML output data.
3.  **Indexing**: Ensure proper indexes exist for foreign keys (`created_by`, `project_id`, `scenario_id`) to optimize `lookup` operations and `populate()` calls.
4.  **Data Retention**: Implement a strategy (e.g., TTL indexes) to purge old or failed scenarios and their associated results if storage costs become a concern.

---

## 5. Security Posture

- **Authentication**: JWT tokens protect API endpoints.
- **Authorization**: Ownership checks are baked into the controller logic (e.g., verifying `scenario.project_id.created_by` matches the `req.user._id`).
- **Connection**: Database connections must use `mongodb+srv://` protocols to ensure TLS encryption in transit.

---

## 6. Local Development Setup

To test changes locally without affecting production:

1. Ensure you have Docker or a local MongoDB community server installed.
2. For Docker, run: `docker run -d -p 27017:27017 --name smart-transit-mongo mongo:latest`
3. In your `server/.env` file, point the connection string to your local instance:
   ```env
   MONGODB_URL=mongodb://127.0.0.1:27017/smart-transit
   ```
4. Start the server (`npm run dev`) and Mongoose will automatically create the database and required initial collections upon connection.
