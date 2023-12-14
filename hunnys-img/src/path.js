import path from "path";

const x = path.format({
  dir: path.join("/input", "test"),
  base: "file.txt",
});

console.log(x);
