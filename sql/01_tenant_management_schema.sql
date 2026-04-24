-- ==========================================
-- StationHub Tenant Management System ERD
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Master: Stasiun
CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    total_area_m2 NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Master: Zona (Area spesifik dalam stasiun)
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g., "Lantai 1 Sayap Timur"
    zone_type VARCHAR(50) NOT NULL, -- "F&B", "Retail", "Services"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Master: Lot (Unit fisik sewa)
CREATE TABLE lots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
    lot_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., "L1-A01"
    size_m2 NUMERIC(10, 2) NOT NULL,
    base_price_per_m2 NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available', -- "Available", "Occupied", "Maintenance"
    coordinates_json JSONB, -- Untuk mapping koordinat di denah SVG
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Master: Tenant
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    pic_name VARCHAR(255) NOT NULL,
    pic_phone VARCHAR(50) NOT NULL,
    pic_email VARCHAR(255) NOT NULL,
    npwp VARCHAR(50),
    business_category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Transaksi: Kontrak Sewa
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    lot_id UUID REFERENCES lots(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent_amount NUMERIC(15, 2) NOT NULL,
    service_charge_amount NUMERIC(15, 2) NOT NULL,
    deposit_amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft', -- "Draft", "Active", "Terminated", "Expired"
    contract_document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel Operasional: Pencatatan Utilitas (Air & Listrik)
CREATE TABLE utility_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    log_month DATE NOT NULL, -- Diisi tgl 1 tiap bulan, e.g., '2024-10-01'
    electricity_kwh NUMERIC(10, 2) DEFAULT 0,
    water_m3 NUMERIC(10, 2) DEFAULT 0,
    recorded_by UUID, -- Referensi ke tabel users admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabel Transaksi: Tagihan (Invoice)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    billing_month DATE NOT NULL,
    base_rent_fee NUMERIC(15, 2) NOT NULL,
    service_charge_fee NUMERIC(15, 2) NOT NULL,
    utility_fee NUMERIC(15, 2) DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid', -- "Unpaid", "Paid", "Overdue"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Create Indexes for performance
CREATE INDEX idx_lots_status ON lots(status);
CREATE INDEX idx_contracts_tenant ON contracts(tenant_id);
CREATE INDEX idx_invoices_status ON invoices(status);
