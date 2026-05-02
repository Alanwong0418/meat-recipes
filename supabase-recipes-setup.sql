-- 肉肉食谱 - Supabase 建表 SQL
-- 在 Supabase Dashboard > SQL Editor 中执行此文件

CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  ingredients JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 关闭 RLS（个人使用，无需登录）
ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;

-- 索引
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);

-- 验证
SELECT 'recipes table created' AS status;
