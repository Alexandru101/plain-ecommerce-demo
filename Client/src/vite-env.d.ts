/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FRIENDLY_CAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";
declare module "*.gif";
declare module "*.webp";