import { SquareClient, SquareEnvironment } from "square";

const isProduction = process.env.NODE_ENV === "production";

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: isProduction ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});
