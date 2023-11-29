import zeroPad from "./zeroPad";

export function getTime() {
  const d = new Date();
  return zeroPad(d.getHours(), 2) + ":" + zeroPad(d.getMinutes(), 2);
}

export function getDate() {
  const d = new Date();
  return `${d.getFullYear()}-${zeroPad(d.getMonth() + 1, 1)}-${zeroPad(
    d.getDate(),
    1
  )}`;
}
