import { MongoDB } from "./database/mongoDB"

const isProduction = !!process.env.PORT

export const env = {
    production: isProduction,
    port: process.env.PORT || undefined,
    db: {
        name: process.env.DB_NAME || "hpa",
        host: process.env.DB_HOST || "localhost",
        port: isProduction ? process.env.DB_PORT : MongoDB.DEFAULT_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
}