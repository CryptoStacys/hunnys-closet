import fs from "fs";
import path from "path";

export default function getFiles(folder) {
  const files = [];
  fs.readdirSync(path.join("src/img", folder)).map((subfolder, i) => {
    fs.readdirSync(path.join("src/img", folder, subfolder)).map((file) => {
      files.push(path.join("src/img", folder, subfolder, file));
    });
  });
  return files;
}