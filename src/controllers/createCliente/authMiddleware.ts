// src/controllers/createCliente/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({ message: "Token não fornecido" });
		}

		const [, token] = authHeader.split(" ");

		const decoded = jwt.verify(
			token,
      process.env.JWT_SECRET as string
		) as JwtPayload;

		req.userId = decoded.userId;

		next();
	} catch (error) {
		return res.status(401).json({ message: "Token inválido ou expirado" });
	}
};
