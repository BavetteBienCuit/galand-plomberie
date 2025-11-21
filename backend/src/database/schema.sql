-- Create database schema for GALAND Plomberie

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'plumber',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory/Stock table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    reference VARCHAR(100) UNIQUE,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_quantity INTEGER DEFAULT 5,
    unit_price DECIMAL(10, 2),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interventions table
CREATE TABLE IF NOT EXISTS interventions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    intervention_date DATE NOT NULL,
    intervention_time TIME,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'planned',
    problem_description TEXT NOT NULL,
    work_done TEXT,
    time_spent DECIMAL(5, 2),
    labor_cost DECIMAL(10, 2),
    materials_cost DECIMAL(10, 2),
    total_cost DECIMAL(10, 2),
    is_urgent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Intervention materials (many-to-many relationship)
CREATE TABLE IF NOT EXISTS intervention_materials (
    id SERIAL PRIMARY KEY,
    intervention_id INTEGER REFERENCES interventions(id) ON DELETE CASCADE,
    inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_interventions_client ON interventions(client_id);
CREATE INDEX IF NOT EXISTS idx_interventions_assigned ON interventions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_interventions_date ON interventions(intervention_date);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);
CREATE INDEX IF NOT EXISTS idx_inventory_reference ON inventory(reference);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123 - CHANGE THIS!)
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('admin@galand-plomberie.fr', '$2b$10$rB8MqVvqE3z0RpK7F6g3PuXxP0oK9mJ0B6h8dY9F3F.1Z0P3h8qN2', 'Admin', 'GALAND', 'admin')
ON CONFLICT (email) DO NOTHING;
