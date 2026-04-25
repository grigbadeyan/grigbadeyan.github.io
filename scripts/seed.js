#!/usr/bin/env node
/**
 * Seed script — run once: node scripts/seed.js
 * Creates the admin user and all 10 original Tsghotner rooms.
 */

const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const DB_PATH = path.join(__dirname, '..', 'data', 'tsghotner.db')
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// ── Create tables (same as db.ts) ─────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name_hy TEXT NOT NULL, name_ru TEXT NOT NULL, name_en TEXT NOT NULL,
    description_hy TEXT, description_ru TEXT, description_en TEXT,
    price INTEGER,
    price_unit_hy TEXT DEFAULT 'ժամ', price_unit_ru TEXT DEFAULT 'час', price_unit_en TEXT DEFAULT 'hour',
    features_hy TEXT DEFAULT '[]', features_ru TEXT DEFAULT '[]', features_en TEXT DEFAULT '[]',
    capacity INTEGER DEFAULT 10, area INTEGER,
    cover_image TEXT, sort_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS room_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL, alt_text TEXT, sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title_hy TEXT NOT NULL, title_ru TEXT NOT NULL, title_en TEXT NOT NULL,
    content_hy TEXT, content_ru TEXT, content_en TEXT,
    meta_title_hy TEXT, meta_title_ru TEXT, meta_title_en TEXT,
    meta_description_hy TEXT, meta_description_ru TEXT, meta_description_en TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, room_id INTEGER REFERENCES rooms(id),
    message TEXT, status TEXT DEFAULT 'new', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_path TEXT NOT NULL, alt_hy TEXT, alt_ru TEXT, alt_en TEXT,
    category TEXT DEFAULT 'general', sort_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// ── Admin user ─────────────────────────────────────────────────────────────────
const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
if (!existing) {
  const hash = bcrypt.hashSync('tsghotner2024', 12)
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hash)
  console.log('✅ Admin user created  →  username: admin  |  password: tsghotner2024')
} else {
  console.log('ℹ️  Admin user already exists')
}

// ── Rooms ─────────────────────────────────────────────────────────────────────
const rooms = [
  {
    slug: 'royal',
    name_hy: 'Ռոյալ', name_ru: 'Роял', name_en: 'Royal',
    description_hy: 'Շքեղ Royal սենյակն ապահովում է ամենաբարձր մակարդակի հանգիստ: Ֆիննական սաունա, ռուսական բաղնիք, հատուկ ջակուզի, հարմարավետ հանգստի սրահ:',
    description_ru: 'Роскошный номер Royal обеспечивает отдых высочайшего класса. Финская сауна, русская баня, индивидуальное джакузи, комфортная гостиная.',
    description_en: 'The luxurious Royal suite offers the highest level of relaxation. Finnish sauna, Russian bath, private jacuzzi, comfortable lounge.',
    price: 25000, capacity: 12, area: 80,
    features_hy: JSON.stringify(['Ֆիննական Սաունա', 'Ռուսական Բաղնիք', 'Ջակուզի', 'Լողավազան', 'Բիլիարդ', 'Ռեստորան']),
    features_ru: JSON.stringify(['Финская Сауна', 'Русская Баня', 'Джакузи', 'Бассейн', 'Биллиард', 'Ресторан']),
    features_en: JSON.stringify(['Finnish Sauna', 'Russian Bath', 'Jacuzzi', 'Pool', 'Billiards', 'Restaurant']),
    cover_image: 'https://tsghotner.am/img/Royal/1.jpg', sort_order: 1,
  },
  {
    slug: 'mirage',
    name_hy: 'Միրաժ', name_ru: 'Мираж', name_en: 'Mirage',
    description_hy: 'Mirage-ն ստեղծում է առեղծվածային մթնոլորտ: Արևելյան ոճի ձևավորում, ճկուն լուսավորություն, ջակուզի:',
    description_ru: 'Мираж создаёт таинственную атмосферу. Восточный стиль декора, гибкое освещение, джакузи.',
    description_en: 'Mirage creates a mysterious atmosphere with Eastern-style décor, flexible lighting, and jacuzzi.',
    price: 20000, capacity: 10, area: 65,
    features_hy: JSON.stringify(['Արևելյան Ոճ', 'Ջակուզի', 'Բաղնիք', 'Ռեստորան']),
    features_ru: JSON.stringify(['Восточный Стиль', 'Джакузи', 'Баня', 'Ресторан']),
    features_en: JSON.stringify(['Eastern Style', 'Jacuzzi', 'Bath', 'Restaurant']),
    cover_image: 'https://tsghotner.am/img/Mirage/1.jpg', sort_order: 2,
  },
  {
    slug: 'big-russian',
    name_hy: 'Մեծ Ռուսական', name_ru: 'Большая Русская', name_en: 'Big Russian',
    description_hy: 'Ավանդական ռուսական բաղնիք մեծ ընտանիքի կամ ընկերների խմբի համար:',
    description_ru: 'Традиционная русская баня для большой семьи или компании друзей.',
    description_en: 'Traditional Russian bath for a large family or group of friends.',
    price: 18000, capacity: 20, area: 90,
    features_hy: JSON.stringify(['Ռուսական Բաղնիք', 'Մեծ Լողավազան', 'Հանգստի Սրահ', 'ԲԲՔ Տարածք']),
    features_ru: JSON.stringify(['Русская Баня', 'Большой Бассейн', 'Зона Отдыха', 'Зона BBQ']),
    features_en: JSON.stringify(['Russian Bath', 'Large Pool', 'Rest Area', 'BBQ Zone']),
    cover_image: 'https://tsghotner.am/img/BigRussian/1.jpg', sort_order: 3,
  },
  {
    slug: 'mini-russian',
    name_hy: 'Մինի Ռուսական', name_ru: 'Мини Русская', name_en: 'Mini Russian',
    description_hy: 'Փոքր ռուսական բաղնիք, հարմար փոքր ընկերությունների համար:',
    description_ru: 'Компактная русская баня, идеальная для небольших компаний.',
    description_en: 'Compact Russian bath, perfect for small groups.',
    price: 12000, capacity: 6, area: 40,
    features_hy: JSON.stringify(['Ռուսական Բաղնիք', 'Լողավազան', 'Հանգստի Սրահ']),
    features_ru: JSON.stringify(['Русская Баня', 'Бассейн', 'Зона Отдыха']),
    features_en: JSON.stringify(['Russian Bath', 'Pool', 'Rest Area']),
    cover_image: 'https://tsghotner.am/img/MiniRussian/1.jpg', sort_order: 4,
  },
  {
    slug: 'edem',
    name_hy: 'Եդեմ', name_ru: 'Едем', name_en: 'Edem',
    description_hy: 'Եդեմ — կատարյալ հանգստի վայր: Ֆիննական սաունա, ջակուզի, ինտիմ մթնոլորտ:',
    description_ru: 'Едем — идеальное место для отдыха. Финская сауна, джакузи, интимная атмосфера.',
    description_en: 'Edem — the perfect retreat. Finnish sauna, jacuzzi, intimate atmosphere.',
    price: 15000, capacity: 8, area: 55,
    features_hy: JSON.stringify(['Ֆիննական Սաունա', 'Ջակուզի', 'Հանգստի Սրահ']),
    features_ru: JSON.stringify(['Финская Сауна', 'Джакузи', 'Зона Отдыха']),
    features_en: JSON.stringify(['Finnish Sauna', 'Jacuzzi', 'Rest Area']),
    cover_image: 'https://tsghotner.am/img/Edem/1.jpg', sort_order: 5,
  },
  {
    slug: 'eastern',
    name_hy: 'Արևելյան', name_ru: 'Восточная', name_en: 'Eastern',
    description_hy: 'Արևելյան բաղնիք — Թուրքական համամ ոճ, գոլ ջուր, արոմաթերապիա:',
    description_ru: 'Восточная баня — турецкий хамам, тёплая вода, ароматерапия.',
    description_en: 'Eastern bath — Turkish hammam style, warm water, aromatherapy.',
    price: 14000, capacity: 8, area: 50,
    features_hy: JSON.stringify(['Թուրքական Համամ', 'Արոմաթերապիա', 'Ջերմ Ջուր', 'Մերսում']),
    features_ru: JSON.stringify(['Турецкий Хамам', 'Ароматерапия', 'Тёплая Вода', 'Массаж']),
    features_en: JSON.stringify(['Turkish Hammam', 'Aromatherapy', 'Warm Water', 'Massage']),
    cover_image: 'https://tsghotner.am/img/Eastern/1.jpg', sort_order: 6,
  },
  {
    slug: 'cottages',
    name_hy: 'Կոттедժներ', name_ru: 'Коттеджи', name_en: 'Cottages',
    description_hy: 'Անջատ կոттedժ-ներ՝ բնության մեջ, մասնավոր տարածք, բոլոր հարմարություններով:',
    description_ru: 'Отдельные коттеджи на природе, частная территория, все удобства.',
    description_en: 'Separate cottages in nature, private grounds, all amenities.',
    price: 30000, capacity: 15, area: 120,
    features_hy: JSON.stringify(['Անջատ Կոttedժ', 'Մասնավոր Բակ', 'Ֆիննական Սաունա', 'ԲԲՔ']),
    features_ru: JSON.stringify(['Отдельный Коттедж', 'Частный Двор', 'Финская Сауна', 'BBQ']),
    features_en: JSON.stringify(['Private Cottage', 'Private Yard', 'Finnish Sauna', 'BBQ']),
    cover_image: 'https://tsghotner.am/img/Cottages/1.jpg', sort_order: 7,
  },
  {
    slug: 'cottage-9',
    name_hy: 'Կոттedժ #9', name_ru: 'Коттедж #9', name_en: 'Cottage #9',
    description_hy: 'Հատուկ #9 կոttedժ, ընտանեկան հանգստի համար:',
    description_ru: 'Особый коттедж #9, для семейного отдыха.',
    description_en: 'Special cottage #9, perfect for family relaxation.',
    price: 35000, capacity: 18, area: 140,
    features_hy: JSON.stringify(['Ֆիննական Սաունա', 'Ռուսական Բաղնիք', 'Լողավազան', 'ԲԲՔ', 'Մասնավոր Բակ']),
    features_ru: JSON.stringify(['Финская Сауна', 'Русская Баня', 'Бассейн', 'BBQ', 'Частный Двор']),
    features_en: JSON.stringify(['Finnish Sauna', 'Russian Bath', 'Pool', 'BBQ', 'Private Yard']),
    cover_image: 'https://tsghotner.am/img/Cottage9/1.jpg', sort_order: 8,
  },
  {
    slug: 'cottage-10',
    name_hy: 'Կոttedժ #10', name_ru: 'Коттедж #10', name_en: 'Cottage #10',
    description_hy: '#10 կottedժ — ընտանեկան հանգիստ, մասնավոր տարածք:',
    description_ru: 'Коттедж #10 — семейный отдых, частная зона.',
    description_en: 'Cottage #10 — family retreat with private outdoor area.',
    price: 38000, capacity: 20, area: 155,
    features_hy: JSON.stringify(['Ֆիննական Սաունա', 'Ռուսական Բաղնիք', 'Լողավազան', 'ԲԲՔ', 'Պարտեզ']),
    features_ru: JSON.stringify(['Финская Сауна', 'Русская Баня', 'Бассейн', 'BBQ', 'Сад']),
    features_en: JSON.stringify(['Finnish Sauna', 'Russian Bath', 'Pool', 'BBQ', 'Garden']),
    cover_image: 'https://tsghotner.am/img/Cottage10/1.jpg', sort_order: 9,
  },
  {
    slug: 'cottage-14',
    name_hy: 'Կոttedժ #14', name_ru: 'Коттедж #14', name_en: 'Cottage #14',
    description_hy: '#14 կottedժ — ամենամեծ և ամենաշքեղ կottedժ-ը:',
    description_ru: 'Коттедж #14 — самый большой и роскошный коттедж.',
    description_en: 'Cottage #14 — the largest and most luxurious cottage.',
    price: 45000, capacity: 25, area: 200,
    features_hy: JSON.stringify(['Ֆիննական Սաունա', 'Ռուսական Բաղնիք', 'Մեծ Լողավազան', 'ԲԲՔ', 'Պարտեզ', 'Բիլիarrd', 'Ռեstorան']),
    features_ru: JSON.stringify(['Финская Сауна', 'Русская Баня', 'Большой Бассейн', 'BBQ', 'Сад', 'Биллиард', 'Ресторан']),
    features_en: JSON.stringify(['Finnish Sauna', 'Russian Bath', 'Large Pool', 'BBQ', 'Garden', 'Billiards', 'Restaurant']),
    cover_image: 'https://tsghotner.am/img/Cottage14/1.jpg', sort_order: 10,
  },
]

const insertRoom = db.prepare(`
  INSERT OR IGNORE INTO rooms
    (slug, name_hy, name_ru, name_en, description_hy, description_ru, description_en,
     price, capacity, area, cover_image, features_hy, features_ru, features_en, sort_order)
  VALUES
    (@slug, @name_hy, @name_ru, @name_en, @description_hy, @description_ru, @description_en,
     @price, @capacity, @area, @cover_image, @features_hy, @features_ru, @features_en, @sort_order)
`)

rooms.forEach(room => {
  insertRoom.run(room)
  console.log(`✅ Room: ${room.name_en}`)
})

// ── About page ────────────────────────────────────────────────────────────────
db.prepare(`INSERT OR IGNORE INTO pages (slug, title_hy, title_ru, title_en, content_hy, content_ru, content_en) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
  'about',
  'Մեր Մասին', 'О нас', 'About Us',
  '«Ծղոտներ» սաունա-հյուրանոցային համալիր- անmոռanaltable հangsist Erevani srdi mej.',
  '«Цхотнер» — центр отдыха в самом сердце Еревана, включающий восточную, русскую, финскую бани, бассейны, джакузи, ресторан и комфортабельные номера.',
  'Tsghotner sauna-hotel complex is located in the heart of Yerevan, comprising Eastern, Russian and Finnish baths, pools, jacuzzi, restaurant and comfortable suites.'
)

// ── Site settings ─────────────────────────────────────────────────────────────
const defaults = { phone1: '010 57 00 20', phone2: '010 57 00 21', phone3: '010 57 00 22', address: 'Zavaryan 97, Yerevan, Armenia', email: 'info@tsghotner.am' }
Object.entries(defaults).forEach(([key, value]) => {
  db.prepare('INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)').run(key, value)
})

console.log('\n🎉 Seed complete!')
console.log('─────────────────────────────')
console.log('Admin URL:  http://localhost:3000/admin')
console.log('Username:   admin')
console.log('Password:   tsghotner2024')
console.log('─────────────────────────────')
console.log('⚠️  Change your password after first login!')
