export const isServer = typeof window === 'undefined' || 'Deno' in globalThis;
