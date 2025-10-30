import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import taskRoutes from "./routes/tasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();

// ✅ CORS Configuration (Frontend URL — change if needed)
const corsOptions = {
  origin: [
    "http://localhost:5173", // Vite default
    "http://127.0.0.1:5173",
    "http://localhost:5174", // in case Vite picks another port
    "http://localhost:5175"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

// Function to find an available port
const findAvailablePort = async (port) => {
  const net = await import('net');
  const server = net.createServer();
  
  return new Promise((resolve, reject) => {
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(port + 1));
      } else {
        reject(err);
      }
    });
    
    server.listen(port, () => {
      server.close(() => {
        resolve(port);
      });
    });
  });
};

// Function to update client .env file with the current port
const updateClientEnv = async (port) => {
  try {
    const clientEnvPath = join(__dirname, '..', 'client', '.env');
    const envContent = `VITE_API_URL=http://localhost:${port}/api\n`;
    await fs.writeFile(clientEnvPath, envContent);
    console.log(`✅ Updated client .env to use port ${port}`);
  } catch (err) {
    console.warn('⚠️ Could not update client .env file:', err.message);
    console.log(`Please update VITE_API_URL in client/.env to: http://localhost:${port}/api`);
  }
};

// Function to start the server
const startServer = async (port) => {
  const server = app.listen(port, '0.0.0.0')
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, trying ${port + 1}...`);
        startServer(port + 1); // Try the next port
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    })
    .on('listening', async () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      await updateClientEnv(port);
    });

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    await mongoose.connection.close();
    server.close(() => {
      console.log('Server stopped');
      process.exit(0);
    });
  });
};

// Start the application
const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const PORT = parseInt(process.env.PORT || '5000', 10);
    await startServer(PORT);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

main();
