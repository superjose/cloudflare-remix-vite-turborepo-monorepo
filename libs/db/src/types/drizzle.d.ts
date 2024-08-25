export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT: string;
      DATABASE_URL: string;
    }
  }
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    dispatch: Dispatch;
    flashStorage: SessionStorage<SessionData, SessionData>;
  }
}
interface Env {
  SEGMENT_APP_KEY: string;
  SESSION_FLASH_SECRET: string;
}

export type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;
