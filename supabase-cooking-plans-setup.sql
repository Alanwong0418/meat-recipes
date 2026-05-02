-- 肉肉食谱 - 补充建表（做菜计划）
-- 在 Supabase Dashboard > SQL Editor 中执行

CREATE TABLE IF NOT EXISTS cooking_plans (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  recipe_name TEXT NOT NULL,
  category TEXT,
  meal_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cooking_plans DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_plans_date ON cooking_plans(date);
