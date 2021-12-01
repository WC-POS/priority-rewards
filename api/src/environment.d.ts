declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      JWT_TTL: string;
      PAGE_SIZE: string;
      SALT_ROUNDS: string;
      TEMP_AUTH_TTL: string;
      TEMP_AUTH_SALT: string;
      MONGO_AUTH: string;
      MONGO_DB: string;
      MONGO_PASSWORD: string;
      MONGO_SERVER: string;
      MONGO_USER: string;
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_SECURE: string;
      EMAIL_AUTH_USER: string;
      EMAIL_AUTH_PASS: string;
      NEXT_PUBLIC_API_HOST: string;
      NODE_ENV: "development" | "production";
      NODE_TLS_REJECT_UNAUTHORIZED: 0 | 1;
      ADMIN_PORT: string;
      API_PORT: string;
      APP_PORT: string;
      SYNC_PORT: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AWS_ENDPOINT: string;
      AWS_API_VERSION: string;
      AWS_BUCKET: string;
      ELECTRON_PUBLIC_API_HOST: string;
      TWILIO_PHONE: string;
      TWILIO_ACCOUNT: string;
      TWILIO_AUTH: string;
    }
  }
}

export {};
