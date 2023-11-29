/**
 * Pad number with zeroes
 * @param  {number} number - The number to be padded
 * @param  {number} pad - How many digits should the output string have in total
 * @returns {string} String of number with zeroes attached
 */
function zeroPad (number: number, pad: number) {
  return String(number).padStart(pad, "0");
};

export default zeroPad;
