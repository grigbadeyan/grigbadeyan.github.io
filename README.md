# Tsghotner — Full-Stack Website

A complete Next.js website with admin panel for **tsghotner.am** — Yerevan's sauna-hotel complex.

## ✅ Features

| Feature | Details |
|---|---|
| 🌍 Multi-language | Armenian (hy), Russian (ru), English (en) with `/hy`, `/ru`, `/en` URL routing |
| 🔐 Admin Login | JWT-based auth with bcrypt passwords |
| 🗄️ Database | SQLite (via better-sqlite3) — zero config, upgradeable to PostgreSQL |
| 📷 Image Upload | Drag & drop in admin, stored in `/public/uploads/` |
| 🏛 Rooms | Full CRUD — name, description, price, capacity, features per language |
| 📄 Pages | Content editor with SEO fields (meta title, meta description) per language |
| 🖼 Gallery | Drag-drop multi-image upload with lightbox |
| 📅 Reservations | Booking form on site → inbox in admin with status management |
| 🔍 SEO-friendly | Server-rendered pages, proper `<head>` metadata, semantic HTML |
| 📱 Responsive | Mobile navbar, fluid grid layouts |

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env.local
# Edit .env.local and change JWT_SECRET to a long random string!
```

### 3. Seed the database (creates admin user + all 10 rooms)
```bash
node scripts/seed.js
```

### 4. Run development server
```bash
npm run dev
```

Visit:
- 🌐 **Website**: http://localhost:3000
- 🔧 **Admin**: http://localhost:3000/admin
  - Username: `admin`
  - Password: `tsghotner2024`

> ⚠️ **Change your password** at `/admin/settings` after first login!

---

## 📁 Project Structure

```
tsghotner/
├── src/
│   ├── app/
│   │   ├── [lang]/               ← Public site routes (/hy, /ru, /en)
│   │   │   ├── page.tsx          ← Homepage (Hero, Rooms, About, Reservation)
│   │   │   ├── rooms/[slug]/     ← Individual room pages
│   │   │   ├── gallery/          ← Gallery page with lightbox
│   │   │   ├── about/            ← About page (content from DB)
│   │   │   └── contact/          ← Contact + reservation form + map
│   │   ├── admin/                ← Protected admin panel (/admin)
│   │   │   ├── login/            ← Login page
│   │   │   ├── page.tsx          ← Dashboard with stats
│   │   │   ├── rooms/            ← Room CRUD editor
│   │   │   ├── gallery/          ← Gallery upload manager
│   │   │   ├── pages/            ← Page content + SEO editor
│   │   │   ├── reservations/     ← Booking inbox + status
│   │   │   └── settings/         ← Contact info + password change
│   │   └── api/
│   │       ├── auth/{login,logout}
│   │       ├── reservations/
│   │       └── admin/{rooms,pages,gallery,upload,settings}
│   ├── components/
│   │   ├── Navbar.tsx            ← Sticky nav with language switcher
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx       ← Full-screen parallax hero
│   │   ├── RoomsSection.tsx      ← Room grid cards
│   │   ├── AboutSection.tsx      ← Stats + feature grid
│   │   ├── ReservationSection.tsx ← Multi-language booking form
│   │   ├── ContactSection.tsx    ← Contact info + Google Maps
│   │   ├── RoomGallery.tsx       ← Masonry gallery with lightbox
│   │   ├── GalleryClient.tsx     ← Public gallery with lightbox
│   │   └── admin/
│   │       └── AdminSidebar.tsx  ← Sidebar with nav + logout
│   └── lib/
│       ├── db.ts                 ← SQLite connection + schema
│       ├── auth.ts               ← JWT + bcrypt utilities
│       └── i18n.ts               ← All translations + helpers
├── scripts/
│   └── seed.js                   ← Seeds admin user + 10 rooms
├── public/
│   └── uploads/                  ← Uploaded images (git-ignored)
├── data/                         ← SQLite database (git-ignored)
└── .env.local                    ← Your secrets (git-ignored)
```

---

## 🌐 Deployment

### Option A — Vercel (Recommended, Free Tier)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set environment variables:
   - `JWT_SECRET` = any long random string
4. Deploy → your site is live!
5. **Custom domain**: Vercel dashboard → Settings → Domains → add `tsghotner.am`
6. Update DNS at your registrar: point A record to Vercel's IP

> **Note for Vercel**: SQLite is not persistent on Vercel's serverless functions. For Vercel deployment, upgrade the database to **Turso** (free SQLite edge DB) or **PlanetScale** (MySQL). See below.

### Option B — VPS (DigitalOcean / Hetzner) — Recommended for SQLite

```bash
# On your VPS (Ubuntu 22.04):
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Clone and build
git clone https://github.com/yourrepo/tsghotner.git
cd tsghotner
npm install
cp .env.example .env.local    # Edit with your JWT_SECRET
node scripts/seed.js
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name tsghotner -- start
pm2 save && pm2 startup

# Nginx config
sudo nano /etc/nginx/sites-available/tsghotner
```

Nginx config:
```nginx
server {
    listen 80;
    server_name tsghotner.am www.tsghotner.am;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Serve uploads directly (better performance)
    location /uploads/ {
        alias /path/to/tsghotner/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/tsghotner /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL (free with Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tsghotner.am -d www.tsghotner.am
```

### DNS Setup

At your domain registrar, set:
```
A     @       → your-server-ip
A     www     → your-server-ip
```

---

## 🗄️ Database

The SQLite database is auto-created at `data/tsghotner.db` on first run.

### Tables
- **users** — Admin accounts
- **rooms** — Hotel rooms (multi-language name, description, features, price, images)
- **room_images** — Additional images per room
- **pages** — Content pages (About, etc.) with SEO fields
- **gallery** — Public gallery images
- **reservations** — Customer booking requests
- **site_settings** — Contact info, social links, etc.

### Backup
```bash
# Simple backup
cp data/tsghotner.db data/tsghotner-backup-$(date +%Y%m%d).db

# Or scheduled (add to crontab):
0 2 * * * cp /path/to/data/tsghotner.db /backups/tsghotner-$(date +\%Y\%m\%d).db
```

---

## 🔧 Admin Panel Usage

### Adding a Room
1. Go to `/admin/rooms` → **+ Add Room**
2. Fill in slug (e.g. `royal`), price, capacity
3. Switch language tabs to add translations for Armenian, Russian, English
4. Upload cover image or paste URL
5. Add features (one per line)
6. Save — room appears on website immediately

### Managing Reservations
1. Go to `/admin/reservations`
2. Click any booking to see full details
3. Update status: New → Confirmed → Completed / Cancelled
4. Use the **Call** button to dial the customer

### Editing Content
1. Go to `/admin/pages`
2. Edit the "about" page or create new pages
3. Fill SEO fields per language for better search rankings

---

## 🔒 Security Checklist

- [ ] Change default password at `/admin/settings`
- [ ] Set a strong random `JWT_SECRET` in `.env.local`
- [ ] Set up SSL (HTTPS) on your server
- [ ] Keep `data/` directory outside web root (already the case)
- [ ] Set up regular database backups

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite via better-sqlite3
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **Styling**: Tailwind CSS + custom CSS variables
- **Fonts**: Cormorant Garamond + Raleway + Noto Serif Armenian
- **Language**: TypeScript

---

## 📞 Support

Tsghotner: 010 57 00 20 · 010 57 00 21 · 010 57 00 22  
Address: Zavaryan 97, Yerevan, Armenia
