"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListandoClienteController = void 0;
const client_1 = require("../../database/client");
const ListandoClienteController = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Não autorizado" });
        }
        const cliente = await client_1.prisma.cliente.findMany({
            where: { usuarioId: Number(req.userId) },
        });
        return res
            .status(200)
            .json({ message: "Todos Cliente Cadastrado", cliente });
    }
    catch (error) {
        return res.status(400).json({ message: "Error Servidor" });
    }
};
exports.ListandoClienteController = ListandoClienteController;
