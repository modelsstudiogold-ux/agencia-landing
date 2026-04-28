/// <reference types="astro/client" />

declare const Astro: import("astro").AstroGlobal;

interface ImportMetaEnv {
	readonly PUBLIC_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
