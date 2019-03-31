import { MongoDB } from "./database/mongoDB"

const isProduction = !!process.env.PORT

export const env = {
    production: isProduction,
    port: process.env.PORT || undefined,
    db: {
        name: process.env.DB_NAME || "studdit",
        host: process.env.DB_HOST || "localhost",
        protocol: isProduction ? "SRV" as "SRV" : "DEFAULT" as "DEFAULT",
        port: isProduction ? process.env.DB_PORT || null : MongoDB.DEFAULT_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
}