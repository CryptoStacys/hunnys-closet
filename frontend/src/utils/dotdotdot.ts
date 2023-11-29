// Helper function that outputs shortened words with ...
export function dotdotdot(input: string, max: number) {
  let dots = "";
  if (input.length >= max) {
    dots = "...";
  }
  return input.substring(0, max) + dots;
}
