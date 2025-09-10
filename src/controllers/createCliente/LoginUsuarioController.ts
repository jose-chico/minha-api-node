/* eslint-disable no-mixed-spaces-and-tabs */
// src/controllers/createCliente/LoginUsuarioController.ts
import { Request, Response } from "express";
import { prisma } from "../../database/client";
import { z, ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginSchema = z.object({
	email: z.string().email("E-mail inválido"),
	senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type Login = z.infer<typeof loginSchema>;

export const LoginUsuarioController = async (req: Request, res: Response) => {
	try {
		const { email, senha }: Login = loginSchema.parse(req.body);

		// procura usuário no banco
		const usuario = await prisma.usuario.findUnique({
			where: { email },
		});

		if (!usuario) {
			return res.status(404).json({ message: "Usuário não encontrado" });
		}

		// compara senha
		const senhaCorreta = await bcrypt.compare(senha, usuario.passwordHash);
		if (!senhaCorreta) {
			return res.status(401).json({ message: "Senha incorreta" });
		}

		// gera token JWT
		const token = jwt.sign(
			{ userId: usuario.id },
            process.env.JWT_SECRET as string, 
            {
            	expiresIn: process.env.JWT_EXPIRES_IN || "7d",
            }
		);

		return res.status(200).json({
			message: "Login realizado com sucesso!",
			token,
		});
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return res.status(400).json(
				error.issues.map((issue) => ({
					message: issue.message,
				}))
			);
		}

		return res.status(500).json({ message: "Erro no servidor" });
	}
};
