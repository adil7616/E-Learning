import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDb } from './Database/db.js';

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from "uploads" folder
app.use('/uploads', express.static('uploads'));

// Routes
import adminRoutes from './routes/admin.js';
import courseRoutes from './routes/course.js';
import userRoutes from './routes/user.js';

app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Server is working');
});

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT; // Default to 5000 if PORT is not set in .env
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDb(); // Connect to the database
});
