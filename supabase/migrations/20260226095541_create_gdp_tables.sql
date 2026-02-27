/*
  # 创建全国GDP数据表

  ## 新建表
    - `provinces`
      - `id` (uuid, 主键)
      - `name` (text, 省份名称)
      - `code` (text, 省份代码)
      - `created_at` (timestamptz)
    
    - `gdp_data`
      - `id` (uuid, 主键)
      - `province_id` (uuid, 外键关联provinces)
      - `year` (integer, 年份)
      - `gdp` (numeric, GDP总值，单位：亿元)
      - `growth_rate` (numeric, 增长率，百分比)
      - `per_capita_gdp` (numeric, 人均GDP，单位：元)
      - `population` (numeric, 人口数，单位：万人)
      - `created_at` (timestamptz)
  
  ## 安全设置
    - 为两个表启用RLS
    - 允许所有用户读取数据（公开数据）
*/

CREATE TABLE IF NOT EXISTS provinces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gdp_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id uuid NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  year integer NOT NULL,
  gdp numeric(12, 2) NOT NULL,
  growth_rate numeric(5, 2) DEFAULT 0,
  per_capita_gdp numeric(12, 2) DEFAULT 0,
  population numeric(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(province_id, year)
);

ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdp_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read provinces"
  ON provinces FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read GDP data"
  ON gdp_data FOR SELECT
  USING (true);

-- 插入示例省份数据
INSERT INTO provinces (name, code) VALUES
  ('北京', 'BJ'),
  ('上海', 'SH'),
  ('广东', 'GD'),
  ('江苏', 'JS'),
  ('浙江', 'ZJ'),
  ('山东', 'SD'),
  ('河南', 'HN'),
  ('四川', 'SC'),
  ('湖北', 'HB'),
  ('福建', 'FJ')
ON CONFLICT (name) DO NOTHING;

-- 插入2023年示例GDP数据
INSERT INTO gdp_data (province_id, year, gdp, growth_rate, per_capita_gdp, population)
SELECT 
  p.id,
  2023,
  CASE p.code
    WHEN 'BJ' THEN 43760.7
    WHEN 'SH' THEN 47218.7
    WHEN 'GD' THEN 135673.2
    WHEN 'JS' THEN 128222.2
    WHEN 'ZJ' THEN 82553.0
    WHEN 'SD' THEN 92068.0
    WHEN 'HN' THEN 61587.8
    WHEN 'SC' THEN 60132.9
    WHEN 'HB' THEN 55803.6
    WHEN 'FJ' THEN 54355.0
  END,
  CASE p.code
    WHEN 'BJ' THEN 5.2
    WHEN 'SH' THEN 5.0
    WHEN 'GD' THEN 4.8
    WHEN 'JS' THEN 5.8
    WHEN 'ZJ' THEN 6.0
    WHEN 'SD' THEN 6.0
    WHEN 'HN' THEN 4.1
    WHEN 'SC' THEN 6.5
    WHEN 'HB' THEN 5.3
    WHEN 'FJ' THEN 4.5
  END,
  CASE p.code
    WHEN 'BJ' THEN 199654
    WHEN 'SH' THEN 189874
    WHEN 'GD' THEN 107671
    WHEN 'JS' THEN 150487
    WHEN 'ZJ' THEN 126115
    WHEN 'SD' THEN 90125
    WHEN 'HN' THEN 62045
    WHEN 'SC' THEN 71687
    WHEN 'HB' THEN 94641
    WHEN 'FJ' THEN 130182
  END,
  CASE p.code
    WHEN 'BJ' THEN 2192.0
    WHEN 'SH' THEN 2487.0
    WHEN 'GD' THEN 12604.0
    WHEN 'JS' THEN 8524.0
    WHEN 'ZJ' THEN 6540.0
    WHEN 'SD' THEN 10223.0
    WHEN 'HN' THEN 9927.0
    WHEN 'SC' THEN 8387.0
    WHEN 'HB' THEN 5902.0
    WHEN 'FJ' THEN 4175.0
  END
FROM provinces p
ON CONFLICT (province_id, year) DO NOTHING;