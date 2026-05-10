-- SunnySide Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Profiles table (single row for the site owner)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY DEFAULT 'default',
  avatar_url TEXT,
  signature TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily photos
CREATE TABLE daily_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  city TEXT NOT NULL DEFAULT '',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities (footprint tracking)
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  arrival_date DATE,
  is_lit BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- City-specific photos
CREATE TABLE city_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_daily_photos_date ON daily_photos(date DESC);
CREATE INDEX idx_cities_province ON cities(province);
CREATE INDEX idx_cities_is_lit ON cities(is_lit);
CREATE INDEX idx_city_photos_city_id ON city_photos(city_id);

-- Insert default profile
INSERT INTO profiles (id, avatar_url, signature)
VALUES ('default', NULL, '用理性写代码，用感性看世界。')
ON CONFLICT (id) DO NOTHING;

-- Insert initial city data
INSERT INTO cities (name, province, arrival_date, is_lit) VALUES
-- 直辖市
('北京', '直辖市', '2021-07-01', true),
('天津', '直辖市', '2021-11-01', true),
('上海', '直辖市', '2023-06-01', true),
('重庆', '直辖市', '2024-05-01', true),
-- 浙江 (11/11 全点亮)
('杭州', '浙江省', '2022-09-29', true),
('宁波', '浙江省', '2023-02-15', true),
('温州', '浙江省', '2023-09-10', true),
('嘉兴', '浙江省', '2022-10-05', true),
('湖州', '浙江省', '2025-06-20', true),
('绍兴', '浙江省', '2023-04-12', true),
('金华', '浙江省', '2024-11-08', true),
('衢州', '浙江省', '2026-01-15', true),
('舟山', '浙江省', '2025-01-20', true),
('台州', '浙江省', '2023-02-18', true),
('丽水', '浙江省', '2025-07-05', true),
-- 云南 (5/16)
('昆明', '云南省', '2025-12-20', true),
('大理', '云南省', '2025-12-22', true),
('丽江', '云南省', '2025-12-25', true),
('西双版纳', '云南省', '2025-12-28', true),
('昭通', '云南省', '2025-12-15', true),
-- 吉林 (4/9)
('长春', '吉林省', '2023-08-05', true),
('吉林', '吉林省', '2023-08-08', true),
('通化', '吉林省', '2023-08-12', true),
('延边', '吉林省', '2023-08-15', true),
-- 江苏 (4/13)
('南京', '江苏省', '2023-02-10', true),
('无锡', '江苏省', '2024-09-15', true),
('苏州', '江苏省', '2023-12-20', true),
('扬州', '江苏省', NULL, true),
-- 福建 (3/9)
('福州', '福建省', '2023-09-05', true),
('泉州', '福建省', '2025-02-10', true),
('宁德', '福建省', '2025-02-15', true),
-- 河北 (3/11)
('石家庄', '河北省', '2026-02-10', true),
('秦皇岛', '河北省', '2023-08-20', true),
('承德', '河北省', '2023-08-22', true),
-- 江西 (3/11)
('南昌', '江西省', '2023-07-05', true),
('九江', '江西省', '2023-07-08', true),
('上饶', '江西省', '2023-07-10', true),
-- 山东 (3/16)
('济南', '山东省', '2025-10-10', true),
('青岛', '山东省', '2025-09-15', true),
('烟台', '山东省', NULL, true),
-- 甘肃 (3/14)
('兰州', '甘肃省', '2024-02-05', true),
('天水', '甘肃省', '2024-02-08', true),
('酒泉', '甘肃省', '2024-02-12', true),
-- 广东 (2/21)
('广州', '广东省', '2026-01-05', true),
('深圳', '广东省', NULL, true),
-- 贵州 (2/9)
('贵阳', '贵州省', '2025-05-10', true),
('黔东南', '贵州省', '2025-05-15', true),
-- 辽宁 (2/14)
('沈阳', '辽宁省', '2023-08-25', true),
('大连', '辽宁省', '2023-08-28', true),
-- 内蒙古 (2/12)
('呼和浩特', '内蒙古', '2024-08-05', true),
('乌兰察布', '内蒙古', '2024-08-10', true),
-- 其他省份
('合肥', '安徽省', '2025-04-10', true),
('武汉', '湖北省', '2023-07-15', true),
('太原', '山西省', '2024-08-15', true),
('成都', '四川省', '2025-12-10', true),
('西安', '陕西省', NULL, true),
('香港', '港澳台', '2026-01-20', true);
