import { MongoDB } from "./database/MongoDB";

const isProduction = !!process.env.PORT

export const env = {
    production: isProduction,
    port: process.env.PORT || 8080,
    db: {
        name: process.env.DB_NAME || "hpa",
        host: process.env.DB_HOST || "localhost",
        port: isProduction ? process.env.DB_PORT : MongoDB.DefaultPort,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
}