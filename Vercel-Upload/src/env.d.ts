// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      ID?: string;
      SECRET?: string;
      ENDPOINT?: string;
      NODE_ENV?: 'development' | 'production';
    }
  }
  