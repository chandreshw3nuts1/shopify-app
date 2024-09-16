// config.js
import dotenv from 'dotenv';

// Load environment variables from a specific path if provided
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

