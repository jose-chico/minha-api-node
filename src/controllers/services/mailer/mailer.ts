// (mantenha o caminho do arquivo como está no seu projeto)
// ex.: src/controllers/services/mailer/mailer.ts  OU  src/services/mailer/mailer.ts
import nodemailer, { Transporter } from "nodemailer";

const env = (k: string) => (process.env[k] || "").trim();
const HOST = env("SMTP_HOST");
const PORT = Number(env("SMTP_PORT") || "587");
const USER = env("SMTP_USER");
const PASS = env("SMTP_PASS");
const FROM = env("MAIL_FROM") || "no-reply@example.com";

// usamos "let" para poder ativar o fallback (Ethereal) se o SMTP real falhar
export let transporter: Transporter = nodemailer.createTransport({
	host: HOST || undefined,
	port: HOST ? PORT : 587,
	secure: HOST ? PORT === 465 : false, // 465 = SSL; 587/2525 = STARTTLS
	auth: USER && PASS ? { user: USER, pass: PASS } : undefined,
});

export async function verifySMTP(): Promise<void> {
	try {
		console.log("[mailer] host:", HOST || "(none)", "port:", PORT, "from:", FROM);
		await transporter.verify();
		console.log("[mailer] SMTP OK");
	} catch (e) {
		console.error("[mailer] SMTP verify error:", e);
		// ---- FALLBACK ETHEREAL (somente DEV) ----
		console.log("[mailer] habilitando fallback Ethereal (somente DEV)...");
		const test = await nodemailer.createTestAccount();
		transporter = nodemailer.createTransport({
			host: test.smtp.host,
			port: test.smtp.port,
			secure: test.smtp.secure,
			auth: { user: test.user, pass: test.pass },
		});
		await transporter.verify();
		console.log("[mailer] Ethereal pronto (pré-visualização no console).");
	}
}

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
	const info = await transporter.sendMail({ from: FROM, to, subject, html });
	// Se cair no Ethereal, o Nodemailer dá uma URL de preview
	const url = nodemailer.getTestMessageUrl(info);
	if (url) console.log("[mailer] Preview Ethereal:", url);
}
