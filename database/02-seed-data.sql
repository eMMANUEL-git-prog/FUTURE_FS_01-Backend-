-- Insert admin user (password: admin123)
INSERT INTO users (email, password_hash, name) 
VALUES (
  'admin@portfolio.com',
  '$2a$10$rQYvN8YZqZqZqZqZqZqZqOxKxKxKxKxKxKxKxKxKxKxKxKxKxKxK',
  'Admin User'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, tech_stack, github_url, demo_url, image_url, order_index) VALUES
(
  'E-Commerce Platform',
  'A full-featured e-commerce platform with shopping cart, payment integration, and admin dashboard.',
  'React, Node.js, Express, PostgreSQL, Stripe',
  'https://github.com/yourusername/ecommerce',
  'https://ecommerce-demo.vercel.app',
  '/placeholder.svg?height=400&width=600',
  1
),
(
  'Task Management App',
  'Collaborative task management application with real-time updates and team features.',
  'Next.js, TypeScript, Prisma, PostgreSQL, Socket.io',
  'https://github.com/yourusername/taskmanager',
  'https://taskmanager-demo.vercel.app',
  '/placeholder.svg?height=400&width=600',
  2
),
(
  'Weather Dashboard',
  'Real-time weather dashboard with forecasts, maps, and location-based alerts.',
  'React, OpenWeather API, Tailwind CSS, Chart.js',
  'https://github.com/yourusername/weather',
  'https://weather-demo.vercel.app',
  '/placeholder.svg?height=400&width=600',
  3
)
ON CONFLICT DO NOTHING;
