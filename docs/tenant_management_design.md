# Blueprint Desain: StationHub Tenant Manager

## 1. Pendahuluan
Dokumen ini merangkum visi teknis dan fungsional untuk aplikasi manajemen tenant pada area stasiun terpadu. Tujuannya adalah untuk mengotomatisasi operasional, meminimalisir kesalahan penagihan, dan memberikan visualisasi aset yang akurat.

---

## 2. Arsitektur Sistem (High-Level)
*   **Frontend**: React.js / Next.js (Responsive Dashboard)
*   **Styling**: Vanilla CSS dengan desain sistem kustom (Premium Dark/Light Mode)
*   **Backend**: Node.js dengan sistem API RESTful
*   **Database**: PostgreSQL (untuk relasi data kompleks antara Stasiun, Area, dan Tenant)
*   **Storage**: Cloud Storage untuk penyimpanan dokumen kontrak (PDF/Images)

---

## 3. Modul Fungsional & Spesifikasi

### A. Modul Dashboard (Analitik)
*   **Widget Utama**: 
    *   Occupancy Rate (Gauge Chart)
    *   Revenue Collection Status (Bar Chart)
    *   Upcoming Expirations (List View)
*   **Filter**: Global filter berdasarkan Nama Stasiun atau Lantai.

### B. Modul Denah Interaktif (Spatial Map)
*   **Teknologi**: SVG Rendering atau Canvas API.
*   **Fitur**:
    *   Mapping koordinat area sewa (Lot ID).
    *   Tooltips informasi tenant saat hover.
    *   Mode filter: "Tampilkan tunggakan", "Tampilkan area kosong".

### C. Modul Manajemen Kontrak (CRM & Document)
*   **Data Entry**:
    *   Identitas Tenant (Nama, Brand, Kategori: F&B/Retail/Service).
    *   Detail Sewa (Luas m2, Harga per m2, Service Charge).
    *   Periode Kontrak (Start Date, End Date).
*   **Workflow**: Draft -> Review -> Active -> Terminated.

### D. Modul Penagihan & Utilitas
*   **Variabel Tagihan**:
    *   Fixed: Sewa Dasar, Service Charge.
    *   Variable: Listrik (KWh), Air (m3).
*   **Automasi**: Sistem menghitung tagihan setiap tanggal 25 dan mengirimkan invoice PDF via email/WhatsApp.

---

## 4. Skema Database (Entitas Utama)

| Tabel | Deskripsi |
| :--- | :--- |
| `stations` | Data induk stasiun (Nama, Lokasi, Total Area). |
| `zones` | Pembagian area per stasiun (Lantai, Sayap, Tipe). |
| `lots` | Unit fisik yang disewakan (Lot ID, Koordinat Map, Ukuran). |
| `tenants` | Profil perusahaan penyewa. |
| `contracts` | Hubungan antara Tenant, Lot, dan Termin Pembayaran. |
| `utility_logs` | Catatan meteran listrik/air bulanan. |
| `invoices` | Data tagihan bulanan dan status pembayaran. |

---

## 5. Panduan Desain UI/UX (Brand Identity)
*   **Prinsip**: "Efficiency over Clutter" (Prioritaskan kemudahan akses data).
*   **Aesthetics**: 
    *   Gunakan **Glassmorphism** untuk kartu informasi di dashboard.
    *   Font: **Inter** (Semi-bold untuk headline, Regular untuk data).
    *   Warna:
        *   `#0F172A` (Slate 900) untuk Background Utama.
        *   `#38BDF8` (Sky 400) untuk Brand Color/Action.
        *   `#10B981` (Emerald 500) untuk Status Aktif.

---

## 6. Alur Implementasi (Roadmap)
1.  **Minggu 1-2**: Setup Database & Core API (Auth & CRUD Tenant).
2.  **Minggu 3-4**: Pengembangan UI Dashboard & Modul Kontrak.
3.  **Minggu 5-6**: Implementasi Sistem Penagihan & Integrasi Meteran Utilitas.
4.  **Minggu 7-8**: Pengembangan Map Interaktif & Testing.

---

## 7. Catatan Khusus Operasional
*   Sistem harus mendukung "Bulk Import" data meteran dari Excel untuk memudahkan tim lapangan.
*   History audit trail harus mencatat setiap perubahan harga sewa atau addendum kontrak.
