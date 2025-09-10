"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// src/routes/router.ts
const express_1 = require("express");
// Usuário / Auth (públicas)
const RegisterUsuarioController_1 = require("../controllers/createCliente/RegisterUsuarioController");
const LoginUsuarioController_1 = require("../controllers/createCliente/LoginUsuarioController");
// Reset de senha (públicas)
const ForgotPasswordController_1 = require("../controllers/auth/ForgotPasswordController");
const ResetPasswordController_1 = require("../controllers/auth/ResetPasswordController");
// Middleware de autenticação
const authMiddleware_1 = require("../controllers/createCliente/authMiddleware");
// Cliente (protegidas)
const CreateClienteController_1 = require("../controllers/createCliente/CreateClienteController");
const ListandoClienteController_1 = require("../controllers/createCliente/ListandoClienteController");
const ListandoUmClienteController_1 = require("../controllers/createCliente/ListandoUmClienteController");
const DeletandoClienteController_1 = require("../controllers/createCliente/DeletandoClienteController");
const AtualizacaoClienteController_1 = require("../controllers/createCliente/AtualizacaoClienteController");
const router = (0, express_1.Router)();
exports.router = router;
/**
 * Rotas públicas
 */
router.post("/usuario", RegisterUsuarioController_1.RegisterUsuarioController);
router.post("/auth/login", LoginUsuarioController_1.LoginUsuarioController);
// Reset de senha
router.post("/auth/forgot-password", ForgotPasswordController_1.ForgotPasswordController);
router.post("/auth/reset-password", ResetPasswordController_1.ResetPasswordController);
/**
 * Rotas protegidas (exigem Bearer Token)
 */
router.post("/cliente", authMiddleware_1.authMiddleware, CreateClienteController_1.CreateClienteController);
router.get("/clientes", authMiddleware_1.authMiddleware, ListandoClienteController_1.ListandoClienteController);
router.get("/cliente/:consumidor", authMiddleware_1.authMiddleware, ListandoUmClienteController_1.ListandoUmClienteController);
router.put("/cliente/:consumidor", authMiddleware_1.authMiddleware, AtualizacaoClienteController_1.AtualizacaoClienteController);
router.delete("/cliente/:consumidor", authMiddleware_1.authMiddleware, DeletandoClienteController_1.DeletarClienteController);
