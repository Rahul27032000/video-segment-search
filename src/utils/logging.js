import { createLogger, format, transports } from "winston";
import Transport from "winston-transport";
import { executeQuery } from "./executeQuery.js";

class PrismaTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  async log(info, callback) {
    process.nextTick(() => this.emit("logged", info));

    try {
      await executeQuery({
        text: `
        INSERT INTO "Log"
        ("requestCode", "requestMethod", "requestUrl", "requestedAt", "responseStatusCode", "responseAt", "log")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        values: [
          info.message?.requestCode ?? "UNKNOWN",
          info.message?.requestMethod ?? "UNKNOWN",
          info.message?.requestUrl ?? "UNKNOWN",
          new Date(info.timestamp) ?? new Date(),
          info.message?.responseStatusCode ?? 500,
          new Date(), 
          info.message?.log ?? {},
        ],
      });
    } catch (error) {
      console.error("Error logging to Prisma:", error);
    }

    callback();
  }
}

export default PrismaTransport;

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new PrismaTransport()],
});
