import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FX Replay API",
      version: "1.0.0",
      description: "Trade Order Management API for the FX Replay challenge",
    },
    servers: [
      {
        url: "/api",
        description: "API server",
      },
    ],
    tags: [
      {
        name: "Trade Orders",
        description: "Trade order management endpoints",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
