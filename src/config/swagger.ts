import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JangbiGO Backend API",
      version: "1.0.0",
      description:
        "A comprehensive Node.js backend API with Kakao OAuth authentication",
      contact: {
        name: "API Support",
        email: "support@jangbigo.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://jangbigo-backend.vercel.app/",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        BaseResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Human-readable response message",
              example: "Operation completed successfully"
            },
            status: {
              type: "integer",
              description: "HTTP status code",
              example: 200
            },
            data: {
              description: "Response data or null for errors",
              oneOf: [
                { type: "object" },
                { type: "array" },
                { type: "null" }
              ]
            }
          },
          required: ["message", "status", "data"]
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
              example: "Validation error"
            },
            status: {
              type: "integer",
              description: "HTTP status code",
              example: 400
            },
            data: {
              type: "object",
              properties: {
                errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: {
                        type: "string",
                        description: "Field name with error",
                        example: "email"
                      },
                      message: {
                        type: "string",
                        description: "Field-specific error message",
                        example: "Invalid email format"
                      }
                    },
                    required: ["field", "message"]
                  }
                }
              }
            }
          },
          required: ["message", "status", "data"]
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/types/*.ts"],
};

export const specs = swaggerJsdoc(options);

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Health check endpoints
 *   - name: Users
 *     description: User management endpoints
 *   - name: Authentication
 *     description: Authentication endpoints
 *   - name: Equipment
 *     description: Equipment management endpoints
 * 
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 *     description: JWT token for authentication
 */
