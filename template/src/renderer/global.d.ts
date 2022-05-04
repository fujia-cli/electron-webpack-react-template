type Styles = Record<string, string>;

declare module '*.png' {
  const png: string;

  export default png;
}

declare module '*.svg' {
  const svg: string;

  export default svg;
}

declare module '*.jpg' {
  const jpg: string;

  export default jpg;
}

declare module '*.scss' {
  const content: Styles;

  export default content;
}

declare module '.css' {
  const content: Styles;

  export default content;
}
