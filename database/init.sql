-- Tablolar
CREATE TABLE IF NOT EXISTS musteriler (
  id SERIAL PRIMARY KEY,
  ad VARCHAR(100),
  sehir VARCHAR(50),
  telefon VARCHAR(20),
  email VARCHAR(100),
  olusturma_tarihi DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS urunler (
  id SERIAL PRIMARY KEY,
  ad VARCHAR(100),
  kategori VARCHAR(50),
  birim_fiyat DECIMAL(10,2),
  stok_miktari INTEGER
);

CREATE TABLE IF NOT EXISTS satislar (
  id SERIAL PRIMARY KEY,
  musteri_id INTEGER REFERENCES musteriler(id),
  urun_id INTEGER REFERENCES urunler(id),
  miktar INTEGER,
  toplam_tutar DECIMAL(10,2),
  satis_tarihi DATE,
  durum VARCHAR(20) DEFAULT 'tamamlandi'
);

CREATE TABLE IF NOT EXISTS personel (
  id SERIAL PRIMARY KEY,
  ad VARCHAR(100),
  departman VARCHAR(50),
  pozisyon VARCHAR(50),
  maas DECIMAL(10,2),
  ise_giris_tarihi DATE
);

-- Müşteri verileri
INSERT INTO musteriler (ad, sehir, telefon, email, olusturma_tarihi) VALUES
('Ahmet Yılmaz', 'İstanbul', '0532 111 2233', 'ahmet@email.com', '2024-01-15'),
('Fatma Kaya', 'Ankara', '0533 222 3344', 'fatma@email.com', '2024-02-20'),
('Mehmet Demir', 'İzmir', '0534 333 4455', 'mehmet@email.com', '2024-03-10'),
('Ayşe Çelik', 'Bursa', '0535 444 5566', 'ayse@email.com', '2024-03-25'),
('Ali Şahin', 'Antalya', '0536 555 6677', 'ali@email.com', '2024-04-05'),
('Zeynep Arslan', 'İstanbul', '0537 666 7788', 'zeynep@email.com', '2024-04-18'),
('Mustafa Koç', 'İzmir', '0538 777 8899', 'mustafa@email.com', '2024-05-02'),
('Elif Öztürk', 'Ankara', '0539 888 9900', 'elif@email.com', '2024-05-20'),
('Hasan Aydın', 'İstanbul', '0530 999 0011', 'hasan@email.com', '2024-06-08'),
('Merve Yıldız', 'Bursa', '0531 000 1122', 'merve@email.com', '2024-06-22');

-- Ürün verileri
INSERT INTO urunler (ad, kategori, birim_fiyat, stok_miktari) VALUES
('Laptop Pro 15', 'Elektronik', 45000.00, 25),
('Mekanik Klavye', 'Elektronik', 1200.00, 80),
('Monitör 27"', 'Elektronik', 8500.00, 40),
('Ofis Koltuğu', 'Mobilya', 3500.00, 30),
('Toplantı Masası', 'Mobilya', 12000.00, 10),
('A4 Kağıt (Koli)', 'Kırtasiye', 450.00, 200),
('Toner HP', 'Kırtasiye', 850.00, 60),
('Mouse Kablosuz', 'Elektronik', 350.00, 120),
('Webcam HD', 'Elektronik', 1800.00, 45),
('Telefon IP', 'Elektronik', 2200.00, 35);

-- Satış verileri
INSERT INTO satislar (musteri_id, urun_id, miktar, toplam_tutar, satis_tarihi) VALUES
(1, 1, 2, 90000.00, '2024-01-20'),
(2, 4, 5, 17500.00, '2024-02-10'),
(3, 2, 3, 3600.00, '2024-02-25'),
(4, 3, 2, 17000.00, '2024-03-05'),
(5, 6, 10, 4500.00, '2024-03-15'),
(6, 1, 1, 45000.00, '2024-04-01'),
(7, 8, 8, 2800.00, '2024-04-20'),
(1, 5, 1, 12000.00, '2024-05-10'),
(2, 9, 4, 7200.00, '2024-05-25'),
(3, 7, 6, 5100.00, '2024-06-05'),
(8, 1, 3, 135000.00, '2024-06-15'),
(9, 3, 5, 42500.00, '2024-07-01'),
(10, 2, 10, 12000.00, '2024-07-20'),
(4, 10, 3, 6600.00, '2024-08-05'),
(5, 4, 8, 28000.00, '2024-08-18'),
(6, 6, 20, 9000.00, '2024-09-02'),
(7, 1, 1, 45000.00, '2024-09-15'),
(8, 8, 15, 5250.00, '2024-10-01'),
(9, 5, 2, 24000.00, '2024-10-20'),
(10, 9, 6, 10800.00, '2024-11-05');

-- Personel verileri
INSERT INTO personel (ad, departman, pozisyon, maas, ise_giris_tarihi) VALUES
('Kemal Avcı', 'Satış', 'Satış Müdürü', 45000.00, '2020-03-01'),
('Selin Kara', 'Muhasebe', 'Muhasebeci', 32000.00, '2021-06-15'),
('Burak Yurt', 'IT', 'Yazılım Geliştirici', 55000.00, '2022-01-10'),
('Neslihan Ay', 'İK', 'İK Uzmanı', 30000.00, '2021-09-20'),
('Tarık Baş', 'Satış', 'Satış Temsilcisi', 25000.00, '2023-02-28'),
('Ceren Güneş', 'Muhasebe', 'Mali Analist', 38000.00, '2022-07-05'),
('Oğuz Deniz', 'IT', 'Sistem Yöneticisi', 48000.00, '2021-11-15'),
('Pınar Şen', 'Pazarlama', 'Pazarlama Uzmanı', 33000.00, '2023-05-10');