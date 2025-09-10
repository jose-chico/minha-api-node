// src/controllers/auth/ResetPasswordController.ts
import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../../database/client";
import { verifyAndConsumeToken } from "../services/resetToken/verifyAndConsumeToken";

const schema = z.object({
	token: z.string().min(1, "Token é obrigatório"),
	novaSenha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export async function ResetPasswordController(req: Request, res: Response) {
	try {
		const { token, novaSenha } = schema.parse(req.body);

		const result = await verifyAndConsumeToken(token);
		if (!result.ok) {
			const map = {
				invalid: "Token inválido",
				expired: "Token expirado",
				used: "Token já utilizado",
			} as const;
			return res.status(401).json({ message: map[result.reason] });
		}

		const passwordHash = await bcrypt.hash(novaSenha, 10);

		await prisma.usuario.update({
			where: { id: result.usuarioId },
			data: { passwordHash },
		});

		return res.status(200).json({ message: "Senha alterada com sucesso." });
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res
				.status(400)
				.json(err.issues.map((i) => ({ message: i.message })));
		}
		console.error("[ResetPassword] error:", err);
		return res.status(500).json({ message: "Erro no servidor" });
	}
}
