// src/routes/router.ts
import { Router } from "express";

// Usuário / Auth (públicas)
import { RegisterUsuarioController } from "../controllers/createCliente/RegisterUsuarioController";
import { LoginUsuarioController } from "../controllers/createCliente/LoginUsuarioController";

// Reset de senha (públicas)
import { ForgotPasswordController } from "../controllers/auth/ForgotPasswordController";
import { ResetPasswordController } from "../controllers/auth/ResetPasswordController";

// Middleware de autenticação
import { authMiddleware } from "../controllers/createCliente/authMiddleware";

// Cliente (protegidas)
import { CreateClienteController } from "../controllers/createCliente/CreateClienteController";
import { ListandoClienteController } from "../controllers/createCliente/ListandoClienteController";
import { ListandoUmClienteController } from "../controllers/createCliente/ListandoUmClienteController";
import { DeletarClienteController } from "../controllers/createCliente/DeletandoClienteController";
import { AtualizacaoClienteController } from "../controllers/createCliente/AtualizacaoClienteController";

const router = Router();

/**
 * Rotas públicas
 */
router.post("/usuario", RegisterUsuarioController);
router.post("/auth/login", LoginUsuarioController);

// Reset de senha
router.post("/auth/forgot-password", ForgotPasswordController);
router.post("/auth/reset-password", ResetPasswordController);

/**
 * Rotas protegidas (exigem Bearer Token)
 */
router.post("/cliente", authMiddleware, CreateClienteController);
router.get("/clientes", authMiddleware, ListandoClienteController);
router.get("/cliente/:consumidor", authMiddleware, ListandoUmClienteController);
router.put("/cliente/:consumidor", authMiddleware, AtualizacaoClienteController);
router.delete("/cliente/:consumidor", authMiddleware, DeletarClienteController);

export { router };
