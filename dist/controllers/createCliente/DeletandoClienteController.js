"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarClienteController = void 0;
const client_1 = require("../../database/client");
const zod_1 = require("zod");
const paramsSchema = zod_1.z.object({
    consumidor: zod_1.z.string().min(1, "consumidor é obrigatório"),
});
const DeletarClienteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Não autorizado" });
        }
        const { consumidor } = paramsSchema.parse(req.params);
        const clienteExiste = yield client_1.prisma.cliente.findFirst({
            where: { consumidor: String(consumidor), usuarioId: Number(req.userId) },
        });
        if (!clienteExiste) {
            return res.status(404).json({ message: "Consumidor não encontrado." });
        }
        const cliente = yield client_1.prisma.cliente.delete({
            where: { id: clienteExiste.id },
        });
        return res.status(200).json({
            message: "Cliente deletado com sucesso!",
            cliente,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json(error.issues.map((issue) => ({ message: issue.message })));
        }
        return res.status(400).json({ message: "Error Servidor" });
    }
});
exports.DeletarClienteController = DeletarClienteController;
