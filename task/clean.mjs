import fs from "node:fs/promises";
import { D_HOME } from "../src/config.mjs";

// ビルド前に出力先を空にする（存在しなくてもエラーにしない）
await fs.rm(D_HOME, { recursive: true, force: true });
