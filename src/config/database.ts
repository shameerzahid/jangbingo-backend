import prisma from "../lib/prisma";
import logger from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info("PostgreSQL Connected via Prisma");
  } catch (error) {
    logger.error("Database connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info("Database disconnected");
  } catch (error) {
    logger.error("Database disconnection error:", error);
  }
};

export { prisma, connectDB, disconnectDB };
