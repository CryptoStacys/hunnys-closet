// Ensure you have the correct type for the parameter. If 'src' is a string, define it as such.
export function customImageLoader({ src }: { src: string }) {
  return `${src}?${new Date().getTime()}`;
}
