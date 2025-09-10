// src/controllers/cliente/AtualizacaoClienteController.ts
import { Request, Response } from "express";
import { prisma } from "../../database/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const paramsSchema = z.object({
	consumidor: z.string().min(1, "consumidor é obrigatório"),
});

const bodySchema = z
	.object({
		consumidor: z.string().min(1).optional(),
		nunerro: z.string().min(1).optional(),
		datass: z.string().min(1).optional(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Informe ao menos um campo para atualizar.",
	});

export const AtualizacaoClienteController = async (req: Request, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ message: "Não autorizado" });
		}

		const { consumidor } = paramsSchema.parse(req.params);
		const data = bodySchema.parse(req.body);

		const clienteExiste = await prisma.cliente.findFirst({
			where: { consumidor: String(consumidor), usuarioId: Number(req.userId) },
		});

		if (!clienteExiste) {
			return res.status(404).json({ message: "Consumidor não encontrado." });
		}

		const clienteAtualizado = await prisma.cliente.update({
			where: { id: clienteExiste.id },
			data,
		});

		return res.status(200).json({
			message: "Cliente atualizado com sucesso!",
			cliente: clienteAtualizado,
		});
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json(error.issues.map((issue) => ({ message: issue.message })));
		}

		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			return res.status(409).json({
				message:
					"Valor já existente para campo único (provável conflito em 'consumidor').",
			});
		}

		return res.status(500).json({ message: "Erro de servidor" });
	}
};
