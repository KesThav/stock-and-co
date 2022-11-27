import winston from "winston";
const { createLogger, transports, format } = winston;
import "winston-mongodb";

const logs = createLogger({
  transports: [
    new transports.MongoDB({
      level: "info",
      db: "mongodb+srv://kesigan:kesi1996@cluster0.hycty.gcp.mongodb.net/logs",
      options: {
        useUnifiedTopology: true,
      },
      format: format.combine(format.timestamp(), format.json()),
    }),
    ,
    new transports.MongoDB({
      level: "error",
      db: "mongodb+srv://kesigan:kesi1996@cluster0.hycty.gcp.mongodb.net/logs",
      options: {
        useUnifiedTopology: true,
      },
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

export default logs;
