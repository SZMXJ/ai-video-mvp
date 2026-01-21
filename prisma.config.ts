// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  // ✅ 连接串在这里配置（而不是 schema.prisma）
  datasource: {
    url: env("DATABASE_URL"),
  },


});
