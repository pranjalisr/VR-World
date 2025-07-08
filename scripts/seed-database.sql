-- Seed data for VR Experience application

-- Insert sample users
INSERT INTO users (username, email, password_hash) VALUES
('john_doe', 'john@example.com', '$2b$10$hashedpassword1'),
('jane_smith', 'jane@example.com', '$2b$10$hashedpassword2'),
('vr_enthusiast', 'enthusiast@example.com', '$2b$10$hashedpassword3');

-- Insert sample VR content
INSERT INTO vr_content (title, description, environment_type, content_url, thumbnail_url, difficulty_level, duration_minutes) VALUES
('Ocean Depths Explorer', 'Dive into the mysterious depths of the ocean and discover marine life', 'underwater', '/vr/ocean-depths', '/thumbnails/ocean.jpg', 'beginner', 15),
('Space Station Adventure', 'Experience life aboard a space station in zero gravity', 'space', '/vr/space-station', '/thumbnails/space.jpg', 'intermediate', 25),
('Ancient Forest Journey', 'Walk through an enchanted ancient forest with magical creatures', 'forest', '/vr/ancient-forest', '/thumbnails/forest.jpg', 'beginner', 20),
('Cyberpunk City Tour', 'Navigate through a futuristic cyberpunk metropolis', 'urban', '/vr/cyberpunk-city', '/thumbnails/cyberpunk.jpg', 'advanced', 30),
('Mountain Peak Climbing', 'Scale treacherous mountain peaks and enjoy breathtaking views', 'mountain', '/vr/mountain-climb', '/thumbnails/mountain.jpg', 'advanced', 40);

-- Insert sample user preferences
INSERT INTO user_preferences (user_id, preferred_environments, comfort_settings, audio_preferences, visual_preferences) VALUES
(1, ARRAY['underwater', 'forest'], 
   '{"motion_sickness_reduction": true, "teleport_movement": true, "comfort_vignetting": true}',
   '{"master_volume": 0.8, "spatial_audio": true, "ambient_sounds": true}',
   '{"brightness": 0.7, "contrast": 0.6, "field_of_view": 90}'),
(2, ARRAY['space', 'urban'], 
   '{"motion_sickness_reduction": false, "teleport_movement": false, "comfort_vignetting": false}',
   '{"master_volume": 1.0, "spatial_audio": true, "ambient_sounds": false}',
   '{"brightness": 0.9, "contrast": 0.8, "field_of_view": 110}'),
(3, ARRAY['mountain', 'forest', 'underwater'], 
   '{"motion_sickness_reduction": true, "teleport_movement": true, "comfort_vignetting": true}',
   '{"master_volume": 0.6, "spatial_audio": true, "ambient_sounds": true}',
   '{"brightness": 0.5, "contrast": 0.7, "field_of_view": 95}');

-- Insert sample interaction data
INSERT INTO interaction_data (user_id, content_id, session_id, interaction_type, interaction_data, duration_seconds, position_data) VALUES
(1, 1, 'session_001', 'gaze', '{"target": "coral_reef", "duration": 3.5}', 3, '{"x": 2.5, "y": -1.2, "z": 5.8, "rotation": {"x": 0, "y": 45, "z": 0}}'),
(1, 1, 'session_001', 'gesture', '{"gesture_type": "point", "target": "fish_school"}', 1, '{"x": 3.1, "y": -0.8, "z": 6.2, "rotation": {"x": -10, "y": 50, "z": 0}}'),
(2, 2, 'session_002', 'controller', '{"button": "trigger", "action": "grab", "object": "tool"}', 2, '{"x": 0.0, "y": 1.8, "z": 0.0, "rotation": {"x": 0, "y": 0, "z": 0}}'),
(3, 3, 'session_003', 'voice', '{"command": "show_map", "confidence": 0.95}', 1, '{"x": -1.5, "y": 0.2, "z": 3.7, "rotation": {"x": 5, "y": -30, "z": 0}}');

-- Insert sample user sessions
INSERT INTO user_sessions (user_id, session_id, content_id, start_time, end_time, total_duration_seconds, completion_status) VALUES
(1, 'session_001', 1, '2024-01-15 10:30:00', '2024-01-15 10:45:00', 900, 'completed'),
(2, 'session_002', 2, '2024-01-15 14:20:00', '2024-01-15 14:45:00', 1500, 'completed'),
(3, 'session_003', 3, '2024-01-15 16:10:00', NULL, NULL, 'in_progress');
