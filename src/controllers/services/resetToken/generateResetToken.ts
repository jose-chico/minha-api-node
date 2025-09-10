// src/services/resetToken/generateResetToken.ts
import crypto from "crypto";
import { prisma } from "../../../database/client"; // <— ajuste aqui

const TTL_MIN = Number(process.env.RESET_TOKEN_TTL_MINUTES || "30");

export async function generateResetTokenAndLink(usuarioId: number) {
	await prisma.passwordResetToken.deleteMany({
		where: { usuarioId, usedAt: null },
	});

	const tokenRaw = crypto.randomBytes(32).toString("hex"); // 64 chars hex
	const tokenHash = crypto.createHash("sha256").update(tokenRaw).digest("hex");

	const expiresAt = new Date(Date.now() + TTL_MIN * 60 * 1000);

	await prisma.passwordResetToken.create({
		data: { tokenHash, expiresAt, usuarioId },
	});

	const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");

	// use ESTA linha se sua página é HTML estático:
	const link = `${appUrl}/resetar-senha.html?token=${tokenRaw}`;

	// // ou use ESTA se for rota SPA:
	// const link = `${appUrl}/resetar-senha?token=${tokenRaw}`;

	return { tokenRaw, link, expiresAt };
}
