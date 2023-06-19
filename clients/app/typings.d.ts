declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

declare namespace globalThis {
  any;
}

declare module 'kjua';
declare module 'biguintle';
declare module 'borc';
interface Window {
  g_app: unknown;
}
declare const II_ENV: string;
