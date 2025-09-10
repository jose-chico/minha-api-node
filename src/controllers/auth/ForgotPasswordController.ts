// src/controllers/auth/ForgotPasswordController.ts
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../database/client";
import { generateResetTokenAndLink } from "../services/resetToken/generateResetToken";
import { sendMail } from "../services/mailer/mailer";
import { resetPasswordTemplate } from "../services/mailer/templates/resetPassword";

const schema = z.object({
	email: z.string().email("E-mail inválido"),
});

export async function ForgotPasswordController(req: Request, res: Response) {
	try {
		const { email } = schema.parse(req.body);

		// Sempre responder 200 para evitar enumeração de e-mails
		const genericOk = () =>
			res.status(200).json({
				message: "Se o e-mail existir, enviaremos um link para redefinição.",
			});

		const usuario = await prisma.usuario.findUnique({
			where: { email },
			select: { id: true, email: true },
		});

		if (!usuario) {
			return genericOk();
		}

		const { link } = await generateResetTokenAndLink(usuario.id);
		

		try {
			await sendMail(
				usuario.email,
				"Redefinição de senha",
				resetPasswordTemplate(link)
			);
		} catch (mailErr) {
			// Não exponha erro de envio; logue e responda genérico
			console.error("[ForgotPassword] sendMail error:", mailErr);
		}

		return genericOk();
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res
				.status(400)
				.json(err.issues.map((i) => ({ message: i.message })));
		}
		console.error("[ForgotPassword] error:", err);
		return res.status(500).json({ message: "Erro no servidor" });
	}
}
