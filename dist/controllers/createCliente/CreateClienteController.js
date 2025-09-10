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
exports.CreateClienteController = void 0;
const client_1 = require("../../database/client");
const zod_1 = require("zod");
// Validação com Zod
const clienteSchema = zod_1.z.object({
    consumidor: zod_1.z.string().min(1, "O campo consumidor é obrigatório."),
    nunerro: zod_1.z.string().min(1, "O campo nunerro é obrigatório."),
    datass: zod_1.z.string().min(1, "O campo datass é obrigatório."),
});
const CreateClienteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Não autorizado" });
        }
        const { consumidor, nunerro, datass } = clienteSchema.parse(req.body);
        const cliente = yield client_1.prisma.cliente.create({
            data: {
                consumidor,
                nunerro,
                datass,
                usuarioId: Number(req.userId),
            },
        });
        return res.status(201).json({
            message: "Cliente cadastrado com sucesso!",
            cliente,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json(error.issues.map((issue) => ({
                message: issue.message,
            })));
        }
        return res.status(500).json({ message: "Erro no servidor" });
    }
});
exports.CreateClienteController = CreateClienteController;
