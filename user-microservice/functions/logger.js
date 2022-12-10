import winston from "winston";
const { createLogger, transports, format } = winston;
import "winston-mongodb";

const logs = createLogger({
  transports: [
    new transports.MongoDB({
      level: "info",
      db: "mongodb://root:password@mongo-logs-microservice:9006/users?authSource=admin",
      options: {
        useUnifiedTopology: true,
      },
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.metadata()
      ),
    }),
    ,
    new transports.MongoDB({
      level: "error",
      db: "mongodb://root:password@mongo-logs-microservice:9006/users?authSource=admin",
      options: {
        useUnifiedTopology: true,
      },
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

export default logs;
