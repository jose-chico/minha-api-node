// src/controllers/cliente/DeletarClientePorParamController.ts
import { Request, Response } from "express";
import { prisma } from "../../database/client";
import { z } from "zod";

const paramsSchema = z.object({
	consumidor: z.string().min(1, "consumidor é obrigatório"),
});

export const DeletarClienteController = async (req: Request, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ message: "Não autorizado" });
		}

		const { consumidor } = paramsSchema.parse(req.params);

		const clienteExiste = await prisma.cliente.findFirst({
			where: { consumidor: String(consumidor), usuarioId: Number(req.userId) },
		});

		if (!clienteExiste) {
			return res.status(404).json({ message: "Consumidor não encontrado." });
		}

		const cliente = await prisma.cliente.delete({
			where: { id: clienteExiste.id },
		});

		return res.status(200).json({
			message: "Cliente deletado com sucesso!",
			cliente,
		});
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json(error.issues.map((issue) => ({ message: issue.message })));
		}

		return res.status(400).json({ message: "Error Servidor" });
	}
};
