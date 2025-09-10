// src/services/resetToken/verifyAndConsumeToken.ts
import crypto from "crypto";
import { prisma } from "../../../database/client";

type VerifyResult =
  | { ok: true; usuarioId: number }
  | { ok: false; reason: "invalid" | "used" | "expired" };

export async function verifyAndConsumeToken(tokenRaw: string): Promise<VerifyResult> {
	const tokenHash = crypto.createHash("sha256").update(tokenRaw).digest("hex");

	const token = await prisma.passwordResetToken.findUnique({
		where: { tokenHash }, // requer @@unique([tokenHash]) no schema (já colocamos)
	});

	if (!token) return { ok: false, reason: "invalid" };
	if (token.usedAt) return { ok: false, reason: "used" };
	if (token.expiresAt.getTime() <= Date.now()) return { ok: false, reason: "expired" };

	// marca como usado (consome)
	await prisma.passwordResetToken.update({
		where: { tokenHash },
		data: { usedAt: new Date() },
	});

	return { ok: true, usuarioId: token.usuarioId };
}
