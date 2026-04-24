import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = 3005;
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on('error', (err) => console.error('Idle client error', err));

// ─── Init Tables ───────────────────────────────────────────────────────────────
async function initTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS maintenance_tickets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT 'Umum',
      status VARCHAR(50) DEFAULT 'Open',
      priority VARCHAR(50) DEFAULT 'Normal',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ticket_updates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ticket_id UUID REFERENCES maintenance_tickets(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      updated_by VARCHAR(100) DEFAULT 'Staff',
      new_status VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

// ─── Seed 6 Stations ───────────────────────────────────────────────────────────
async function seedDatabase() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM stations');
  if (parseInt(rows[0].count) >= 6) return;
  console.log('🌱 Seeding 6 stations...');

  await pool.query('DELETE FROM ticket_updates');
  await pool.query('DELETE FROM maintenance_tickets');
  await pool.query('DELETE FROM contracts');
  await pool.query('DELETE FROM lots');
  await pool.query('DELETE FROM tenants');
  await pool.query('DELETE FROM zones');
  await pool.query('DELETE FROM stations');

  const stationDefs = [
    { name: 'Stasiun Gambir',      location: 'Jakarta Pusat',  area: 5000 },
    { name: 'Stasiun Manggarai',   location: 'Jakarta Selatan', area: 4500 },
    { name: 'Stasiun Tanah Abang', location: 'Jakarta Pusat',  area: 3800 },
    { name: 'Stasiun Bogor',       location: 'Bogor',          area: 3500 },
    { name: 'Stasiun Bekasi',      location: 'Bekasi',         area: 4000 },
    { name: 'Stasiun Depok',       location: 'Depok',          area: 3200 },
  ];

  const tenantDefs = [
    // Gambir
    [
      { c:'PT Kopi Kenangan Nusantara',       b:'Kopi Kenangan',   pic:'Budi Santoso',    ph:'081234567890', e:'budi@kopikenangan.id',    cat:'F&B',      lot:'GB-A01', size:50, price:150000 },
      { c:'PT Indomarco Prismatama',          b:'Indomaret Point', pic:'Siti Rahma',      ph:'081987654321', e:'siti@indomaret.co.id',    cat:'Retail',   lot:'GB-A02', size:45, price:150000 },
      { c:'PT Rekso Nasional Food',           b:'McDonalds',       pic:'Andi Wijaya',     ph:'085612345678', e:'andi@mcdonalds.co.id',    cat:'F&B',      lot:'GB-B01', size:60, price:200000 },
      { c:'PT Bank Mandiri Tbk',             b:'ATM Mandiri',     pic:'Rina Marlina',    ph:'081345678912', e:'rina@bankmandiri.co.id',  cat:'Services', lot:'GB-B02', size:20, price:200000 },
      { c:'PT Erajaya Swasembada',            b:'Erafone',         pic:'Reza Pahlevi',    ph:'082199887766', e:'reza@erafone.com',        cat:'Retail',   lot:'GB-C01', size:40, price:180000 },
    ],
    // Manggarai
    [
      { c:'PT Sari Coffee Indonesia',         b:'Starbucks',       pic:'Dewi Putri',      ph:'081122334455', e:'dewi@starbucks.co.id',    cat:'F&B',      lot:'MG-A01', size:55, price:160000 },
      { c:'PT Sumber Alfaria Trijaya',        b:'Alfamart',        pic:'Hendra Susilo',   ph:'082233445566', e:'hendra@alfamart.co.id',   cat:'Retail',   lot:'MG-A02', size:50, price:155000 },
      { c:'PT Fast Food Indonesia',           b:'KFC',             pic:'Maya Sari',       ph:'083344556677', e:'maya@kfc.co.id',          cat:'F&B',      lot:'MG-B01', size:65, price:210000 },
      { c:'PT Bank Central Asia Tbk',        b:'ATM BCA',         pic:'Dian Purnama',    ph:'084455667788', e:'dian@bca.co.id',         cat:'Services', lot:'MG-B02', size:20, price:195000 },
      { c:'PT Apple Authorised Reseller',    b:'iBox',            pic:'Kevin Saputra',   ph:'085566778899', e:'kevin@ibox.co.id',        cat:'Retail',   lot:'MG-C01', size:45, price:185000 },
    ],
    // Tanah Abang
    [
      { c:'PT Tata Sari Nutrisi',            b:'Chatime',         pic:'Lisa Anggraini',  ph:'086677889900', e:'lisa@chatime.co.id',      cat:'F&B',      lot:'TA-A01', size:35, price:145000 },
      { c:'PT Midi Utama Indonesia',         b:'Lawson',          pic:'Bayu Eko',        ph:'087788990011', e:'bayu@lawson.co.id',       cat:'Retail',   lot:'TA-A02', size:48, price:148000 },
      { c:'PT Sarimelati Kencana',           b:'Pizza Hut',       pic:'Tina Lestari',    ph:'088899001122', e:'tina@pizzahut.co.id',     cat:'F&B',      lot:'TA-B01', size:70, price:205000 },
      { c:'PT Bank Negara Indonesia Tbk',    b:'ATM BNI',         pic:'Wahyu Nugroho',   ph:'089900112233', e:'wahyu@bni.co.id',         cat:'Services', lot:'TA-B02', size:20, price:190000 },
      { c:'PT Samsung Electronics Indonesia',b:'Samsung Store',   pic:'Agung Prasetyo',  ph:'081011223344', e:'agung@samsung.co.id',     cat:'Retail',   lot:'TA-C01', size:42, price:178000 },
    ],
    // Bogor
    [
      { c:'PT Mixue Indonesia',              b:'Mixue',           pic:'Nadia Permata',   ph:'081122334456', e:'nadia@mixue.co.id',       cat:'F&B',      lot:'BG-A01', size:30, price:130000 },
      { c:'PT Midi Utama Indonesia',         b:'Alfamidi',        pic:'Yogi Pratama',    ph:'082233445567', e:'yogi@alfamidi.co.id',     cat:'Retail',   lot:'BG-A02', size:40, price:132000 },
      { c:'PT Eka Bogainti',                 b:'Hokben',          pic:'Lia Susanti',     ph:'083344556678', e:'lia@hokben.co.id',        cat:'F&B',      lot:'BG-B01', size:55, price:175000 },
      { c:'PT Bank Rakyat Indonesia Tbk',    b:'ATM BRI',         pic:'Dodi Firmansyah', ph:'084455667789', e:'dodi@bri.co.id',          cat:'Services', lot:'BG-B02', size:20, price:165000 },
      { c:'PT Xiaomi Technology Indonesia',  b:'Xiaomi Store',    pic:'Fani Kartika',    ph:'085566778890', e:'fani@xiaomi.co.id',       cat:'Retail',   lot:'BG-C01', size:38, price:155000 },
    ],
    // Bekasi
    [
      { c:'PT Koi Cafe Indonesia',           b:'KOI Café',        pic:'Rizky Aditya',    ph:'086677889901', e:'rizky@koicafe.co.id',     cat:'F&B',      lot:'BK-A01', size:42, price:140000 },
      { c:'PT Circle K Indonesia',           b:'Circle K',        pic:'Putri Rahayu',    ph:'087788990012', e:'putri@circlek.co.id',     cat:'Retail',   lot:'BK-A02', size:38, price:138000 },
      { c:'PT Cipta Makan Bersama',          b:'Burger King',     pic:'Adi Kurniawan',   ph:'088899001123', e:'adi@burgerking.co.id',    cat:'F&B',      lot:'BK-B01', size:58, price:185000 },
      { c:'PT Bank Tabungan Negara Tbk',     b:'ATM BTN',         pic:'Sri Mulyani',     ph:'089900112234', e:'sri@btn.co.id',           cat:'Services', lot:'BK-B02', size:20, price:170000 },
      { c:'PT OPPO Electronics Indonesia',   b:'Oppo Store',      pic:'Deni Setiawan',   ph:'081011223345', e:'deni@oppo.co.id',         cat:'Retail',   lot:'BK-C01', size:35, price:158000 },
    ],
    // Depok
    [
      { c:'PT Es Teh Indonesia',             b:'Es Teh Indonesia',pic:'Laila Fitri',     ph:'081122334457', e:'laila@esteh.co.id',       cat:'F&B',      lot:'DP-A01', size:28, price:128000 },
      { c:'PT Indomarco Prismatama',         b:'Indomaret',       pic:'Bambang Riyanto', ph:'082233445568', e:'bambang@indomaret.co.id', cat:'Retail',   lot:'DP-A02', size:42, price:130000 },
      { c:'PT Solaria Resto',                b:'Solaria',         pic:'Citra Dewi',      ph:'083344556679', e:'citra@solaria.co.id',     cat:'F&B',      lot:'DP-B01', size:65, price:172000 },
      { c:'PT Bank Permata Tbk',             b:'ATM Permata',     pic:'Eko Prasetya',    ph:'084455667790', e:'eko@permatabank.co.id',   cat:'Services', lot:'DP-B02', size:20, price:162000 },
      { c:'PT Realme Indonesia',             b:'Realme Store',    pic:'Gina Cahyani',    ph:'085566778891', e:'gina@realme.co.id',       cat:'Retail',   lot:'DP-C01', size:33, price:150000 },
    ],
  ];

  for (let s = 0; s < stationDefs.length; s++) {
    const st = stationDefs[s];
    const sRes = await pool.query(
      `INSERT INTO stations (name, location, total_area_m2) VALUES ($1,$2,$3) RETURNING id`,
      [st.name, st.location, st.area]
    );
    const stId = sRes.rows[0].id;
    const zRes = await pool.query(
      `INSERT INTO zones (station_id, name, zone_type) VALUES ($1,'Main Concourse','Retail') RETURNING id`,
      [stId]
    );
    const zId = zRes.rows[0].id;

    for (const t of tenantDefs[s]) {
      const tRes = await pool.query(
        `INSERT INTO tenants (company_name, brand_name, pic_name, pic_phone, pic_email, business_category)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [t.c, t.b, t.pic, t.ph, t.e, t.cat]
      );
      const tId = tRes.rows[0].id;

      const lRes = await pool.query(
        `INSERT INTO lots (zone_id, lot_number, size_m2, base_price_per_m2, status, coordinates_json)
         VALUES ($1,$2,$3,$4,'Occupied',$5) RETURNING id`,
        [zId, t.lot, t.size, t.price, JSON.stringify({ x:10, y:20, width:20, height:25 })]
      );
      await pool.query(
        `INSERT INTO contracts (tenant_id, lot_id, start_date, end_date, monthly_rent_amount, service_charge_amount, deposit_amount, status)
         VALUES ($1,$2, CURRENT_DATE - INTERVAL '3 months', CURRENT_DATE + INTERVAL '1 year', $3, 500000, 2000000, 'Active')`,
        [tId, lRes.rows[0].id, t.size * t.price]
      );
    }
  }

  // Seed sample tickets
  const allTenants = (await pool.query('SELECT id, brand_name FROM tenants LIMIT 6')).rows;
  const ticketSamples = [
    { title:'AC Bocor di Area Kasir', desc:'Terjadi kebocoran air dari unit AC ceiling di atas area kasir.', cat:'AC & Ventilasi', status:'In Progress', priority:'Tinggi' },
    { title:'Lampu Signage Mati', desc:'Lampu pada papan nama/signage bagian depan unit tidak menyala.', cat:'Listrik', status:'Open', priority:'Normal' },
    { title:'Kran Air Bocor di Toilet', desc:'Kran wastafel bocor dan menyebabkan genangan di lantai toilet.', cat:'Plumbing', status:'Resolved', priority:'Normal' },
    { title:'Pintu Shutter Macet', desc:'Pintu rolling shutter susah dibuka/ditutup saat jam operasional.', cat:'Konstruksi', status:'Open', priority:'Tinggi' },
    { title:'Saluran Air Tersumbat', desc:'Saluran pembuangan air kotor di dapur tersumbat.', cat:'Plumbing', status:'In Progress', priority:'Normal' },
    { title:'Panel Listrik Panas', desc:'Panel listrik di dalam unit terasa sangat panas saat jam sibuk.', cat:'Listrik', status:'Open', priority:'Kritis' },
  ];
  for (let i = 0; i < ticketSamples.length; i++) {
    const tk = ticketSamples[i];
    const tenant = allTenants[i % allTenants.length];
    const tRes = await pool.query(
      `INSERT INTO maintenance_tickets (tenant_id, title, description, category, status, priority)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [tenant.id, tk.title, tk.desc, tk.cat, tk.status, tk.priority]
    );
    await pool.query(
      `INSERT INTO ticket_updates (ticket_id, message, updated_by, new_status)
       VALUES ($1,'Tiket diterima dan dicatat oleh tim facility.','System',$2)`,
      [tRes.rows[0].id, tk.status]
    );
  }
  console.log('✅ Seed complete: 6 stations, 30 tenants, 6 tickets');
}

initTables().then(seedDatabase).catch(console.error);

// ─── TENANTS ──────────────────────────────────────────────────────────────────
app.get('/api/tenants', async (req, res) => {
  try {
    const { station_id } = req.query;
    const where = station_id ? `WHERE s.id = $1` : '';
    const params = station_id ? [station_id] : [];
    const result = await pool.query(`
      SELECT t.*, l.lot_number, c.status as contract_status, c.monthly_rent_amount,
             s.id as station_id, s.name as station_name
      FROM tenants t
      LEFT JOIN contracts c ON c.tenant_id = t.id AND c.status = 'Active'
      LEFT JOIN lots l ON c.lot_id = l.id
      LEFT JOIN zones z ON l.zone_id = z.id
      LEFT JOIN stations s ON z.station_id = s.id
      ${where}
      ORDER BY s.name, t.brand_name
    `, params);
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.post('/api/tenants', async (req, res) => {
  try {
    const { company_name, brand_name, pic_name, pic_phone, pic_email, npwp, business_category } = req.body;
    const r = await pool.query(
      `INSERT INTO tenants (company_name, brand_name, pic_name, pic_phone, pic_email, npwp, business_category)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [company_name, brand_name, pic_name, pic_phone, pic_email, npwp, business_category]
    );
    res.json(r.rows[0]);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.put('/api/tenants/:id', async (req, res) => {
  try {
    const { company_name, brand_name, pic_name, pic_phone, pic_email, npwp, business_category } = req.body;
    const r = await pool.query(
      `UPDATE tenants SET company_name=$1, brand_name=$2, pic_name=$3, pic_phone=$4,
       pic_email=$5, npwp=$6, business_category=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [company_name, brand_name, pic_name, pic_phone, pic_email, npwp, business_category, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.delete('/api/tenants/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM contracts WHERE tenant_id=$1', [req.params.id]);
    await pool.query('DELETE FROM maintenance_tickets WHERE tenant_id=$1', [req.params.id]);
    await pool.query('DELETE FROM tenants WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── STATIONS ─────────────────────────────────────────────────────────────────
app.get('/api/stations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stations ORDER BY name');
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── LOTS ─────────────────────────────────────────────────────────────────────
app.get('/api/lots', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, t.brand_name FROM lots l
      LEFT JOIN contracts c ON c.lot_id = l.id AND c.status = 'Active'
      LEFT JOIN tenants t ON t.id = c.tenant_id
      ORDER BY l.lot_number
    `);
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── TICKETS ──────────────────────────────────────────────────────────────────
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mt.*, t.brand_name FROM maintenance_tickets mt
      LEFT JOIN tenants t ON t.id = mt.tenant_id
      ORDER BY mt.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.get('/api/tickets/:id', async (req, res) => {
  try {
    const ticket = await pool.query(
      `SELECT mt.*, t.brand_name FROM maintenance_tickets mt
       LEFT JOIN tenants t ON t.id = mt.tenant_id WHERE mt.id=$1`, [req.params.id]
    );
    const updates = await pool.query(
      `SELECT * FROM ticket_updates WHERE ticket_id=$1 ORDER BY created_at ASC`, [req.params.id]
    );
    res.json({ ...ticket.rows[0], updates: updates.rows });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.get('/api/tickets/tenant/:tenantId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM maintenance_tickets WHERE tenant_id=$1 ORDER BY created_at DESC`,
      [req.params.tenantId]
    );
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const { tenant_id, title, description, category, priority } = req.body;
    const r = await pool.query(
      `INSERT INTO maintenance_tickets (tenant_id, title, description, category, priority)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [tenant_id, title, description || '', category || 'Umum', priority || 'Normal']
    );
    await pool.query(
      `INSERT INTO ticket_updates (ticket_id, message, updated_by, new_status)
       VALUES ($1,'Tiket baru dibuat.','System','Open')`, [r.rows[0].id]
    );
    res.json(r.rows[0]);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.post('/api/tickets/:id/updates', async (req, res) => {
  try {
    const { message, updated_by, new_status } = req.body;
    const upd = await pool.query(
      `INSERT INTO ticket_updates (ticket_id, message, updated_by, new_status)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.params.id, message, updated_by || 'Staff', new_status]
    );
    if (new_status) {
      await pool.query(
        `UPDATE maintenance_tickets SET status=$1, updated_at=NOW() WHERE id=$2`,
        [new_status, req.params.id]
      );
    }
    res.json(upd.rows[0]);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
app.get('/api/dashboard', async (req, res) => {
  try {
    const lotsRes = await pool.query(
      `SELECT COUNT(*) as total_lots, SUM(CASE WHEN status='Occupied' THEN 1 ELSE 0 END) as occupied_lots FROM lots`
    );
    const revRes = await pool.query(
      `SELECT SUM(monthly_rent_amount) as total_monthly FROM contracts WHERE status='Active'`
    );
    const recentTenantsRes = await pool.query(`
      SELECT t.id, t.brand_name, t.business_category, t.created_at, l.lot_number, c.status
      FROM tenants t
      LEFT JOIN contracts c ON c.tenant_id = t.id
      LEFT JOIN lots l ON c.lot_id = l.id
      ORDER BY t.created_at DESC LIMIT 10
    `);
    const ticketsRes = await pool.query(`
      SELECT mt.*, t.brand_name FROM maintenance_tickets mt
      LEFT JOIN tenants t ON t.id = mt.tenant_id
      ORDER BY mt.created_at DESC LIMIT 10
    `);

    const totalLots = parseInt(lotsRes.rows[0].total_lots) || 0;
    const occupiedLots = parseInt(lotsRes.rows[0].occupied_lots) || 0;
    const occupancyRate = totalLots > 0 ? Math.round((occupiedLots / totalLots) * 100) : 0;
    const monthlyRevenue = parseFloat(revRes.rows[0].total_monthly) || 0;

    // 12-month revenue forecast
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), currentMonth + 1, 0).getDate();
    const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const TARGET_MULTIPLIER = 1.1; // target 10% above current monthly

    const revenueChart = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      target: Math.round(monthlyRevenue * TARGET_MULTIPLIER),
      actual: i < currentMonth
        ? Math.round(monthlyRevenue * (0.85 + Math.random() * 0.2))
        : i === currentMonth
          ? Math.round(monthlyRevenue * (dayOfMonth / daysInMonth))
          : 0,
    }));

    res.json({
      occupancy_rate: occupancyRate,
      active_tenants: occupiedLots,
      monthly_revenue: monthlyRevenue,
      recent_tenants: recentTenantsRes.rows,
      revenue_chart: revenueChart,
      tickets: ticketsRes.rows,
    });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
}

export default app;
