interface Logger {
  info: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

const logger: Logger = {
  info: (message: string, ...args: any[]): void => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },

  error: (message: string, ...args: any[]): void => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },

  warn: (message: string, ...args: any[]): void => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },

  debug: (message: string, ...args: any[]): void => {
    if (process.env["NODE_ENV"] === "development") {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
};

export default logger;
