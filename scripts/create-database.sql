-- VR Experience Database Schema

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Content table for storing VR environments and assets
CREATE TABLE IF NOT EXISTS vr_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    environment_type VARCHAR(50) NOT NULL,
    content_url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    duration_minutes INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences table for personalized experiences
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    preferred_environments TEXT[], -- Array of environment types
    comfort_settings JSONB, -- Motion sickness settings, etc.
    audio_preferences JSONB, -- Volume, spatial audio settings
    visual_preferences JSONB, -- Brightness, contrast, field of view
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interaction Data table for tracking user interactions
CREATE TABLE IF NOT EXISTS interaction_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content_id INTEGER REFERENCES vr_content(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'gaze', 'gesture', 'controller', 'voice'
    interaction_data JSONB, -- Detailed interaction information
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INTEGER,
    position_data JSONB -- 3D coordinates and orientation
);

-- User Sessions table for tracking VR sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    content_id INTEGER REFERENCES vr_content(id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    total_duration_seconds INTEGER,
    completion_status VARCHAR(20) DEFAULT 'in_progress'
);
