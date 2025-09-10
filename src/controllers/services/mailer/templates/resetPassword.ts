// src/services/mailer/templates/resetPassword.ts

export function resetPasswordTemplate(link: string) {
	return `
  <div style="font-family: Arial, sans-serif; max-width: 520px;">
    <h2>Redefinição de senha</h2>
    <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo para continuar:</p>
    <p style="margin: 24px 0;">
      <a href="${link}" target="_blank"
         style="background:#16a34a;color:#fff;padding:12px 18px;text-decoration:none;border-radius:8px;">
        Redefinir senha
      </a>
    </p>
    <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
    <p style="word-break: break-all;">${link}</p>
    <p style="color:#667085;font-size:13px">Este link expira em 30 minutos. Se não foi você, ignore este e-mail.</p>
  </div>
  `;
}
