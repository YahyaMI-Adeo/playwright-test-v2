declare namespace NodeJS {
    interface ProcessEnv {
        EXTERNAL_USERNAME: string;
        EXTERNAL_PASSWORD: string;
        INTERNAL_USERNAME: string;
        INTERNAL_PASSWORD: string;
        EXTERNAL_UNAUTHORIZED_USERNAME: string;
        EXTERNAL_UNAUTHORIZED_PASSWORD: string;

    }
}
