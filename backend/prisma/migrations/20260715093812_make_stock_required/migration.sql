-- Give existing NULL stocks a value
UPDATE "Product"
SET "stock" = 0
WHERE "stock" IS NULL;

-- Make stock required
ALTER TABLE "Product"
ALTER COLUMN "stock" SET NOT NULL;