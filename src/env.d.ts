/// <reference types="astro/client" />

declare const Astro: import("astro").AstroGlobal;

interface ImportMetaEnv {
	readonly PUBLIC_GTM_CONTAINER_ID?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
