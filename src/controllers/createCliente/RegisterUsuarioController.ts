// src/controllers/createCliente/RegisterUsuarioController.ts
import { Request, Response } from "express";
import { prisma } from "../../database/client";
import { z, ZodError } from "zod";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

const usuarioSchema = z.object({
	email: z.string().email("E-mail inválido"),
	senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

	type Usuario = z.infer<typeof usuarioSchema>;

export const RegisterUsuarioController = async (req: Request, res: Response) => {
	try {
		const { email, senha }: Usuario = usuarioSchema.parse(req.body);

		const passwordHash = await bcrypt.hash(senha, 10);

		const usuario = await prisma.usuario.create({
			data: { email, passwordHash },
		});

		return res.status(201).json({
			message: "Usuário cadastrado com sucesso!",
			usuario: { id: usuario.id, email: usuario.email },
		});
	} catch (error: unknown) {
		console.error("REGISTER ERROR:", error);

		if (error instanceof ZodError) {
			return res.status(400).json(
				error.issues.map((issue) => ({ message: issue.message }))
			);
		}

		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			return res.status(409).json({ message: "E-mail já cadastrado." });
		}

		return res.status(500).json({ message: "Erro no servidor" });
	}
};
