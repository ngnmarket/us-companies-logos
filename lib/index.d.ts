export type LogoFormat = "png" | "webp" | "ico";

export function getLogoPath(symbol: string, format?: LogoFormat): string;
export function getLogoUrl(symbol: string, format?: LogoFormat): string;
export function listSymbols(): string[];
export function hasLogo(symbol: string, format?: LogoFormat): boolean;
export const FORMATS: readonly LogoFormat[];

