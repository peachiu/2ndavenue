import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const svgPath = resolve("public/logo.svg");
const pngPath = resolve("public/logo.png");

const svgBuffer = readFileSync(svgPath);

await sharp(svgBuffer)
    .resize(500, 500)
    .png()
    .toFile(pngPath);

console.log("✅ PNG generated:", pngPath);
