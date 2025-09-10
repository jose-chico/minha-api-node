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
exports.ListandoClienteController = void 0;
const client_1 = require("../../database/client");
const ListandoClienteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Não autorizado" });
        }
        const cliente = yield client_1.prisma.cliente.findMany({
            where: { usuarioId: Number(req.userId) },
        });
        return res
            .status(200)
            .json({ message: "Todos Cliente Cadastrado", cliente });
    }
    catch (error) {
        return res.status(400).json({ message: "Error Servidor" });
    }
});
exports.ListandoClienteController = ListandoClienteController;
