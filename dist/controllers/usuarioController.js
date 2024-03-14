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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioController = void 0;
const validator_1 = __importDefault(require("validator"));
const connection_1 = __importDefault(require("../utils/connection"));
const utils_1 = require("../utils/utils");
class UsuarioController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.then((connection) => __awaiter(this, void 0, void 0, function* () {
                    return yield connection.query("SELECT * FROM tbl_usuario");
                }));
                res.json(result);
            }
            catch (error) {
                return res.status(500).json({ message: `${error.message}` });
            }
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!validator_1.default.isEmail(req.body.email)) {
                    return res.status(400).json({ message: "Correo electrónico no válido" });
                }
                if (!validator_1.default.isStrongPassword(req.body.password, { minLength: 8 })) {
                    return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
                }
                if (!req.body.password) {
                    return res.status(400).json({ message: "La contraseña debe ser llenada" });
                }
                // Validar que el rol no esté vacío
                if (!req.body.role) {
                    return res.status(400).json({ message: "El rol es obligatorio" });
                }
                const encryptedText = yield utils_1.utils.hashPassword(req.body.password);
                if (!encryptedText) {
                    return res.status(500).json({ message: "Error al cifrar la contraseña" });
                }
                req.body.password = encryptedText;
                const result = yield connection_1.default.then((connection) => __awaiter(this, void 0, void 0, function* () {
                    return yield connection.query('INSERT INTO tbl_usuario SET ?', req.body);
                }));
                res.json({ text: "Usuario agregado" });
            }
            catch (error) {
                return res.status(500).json({ message: `${error.message}` });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const updateUser = req.body;
            try {
                if (req.body.email && !validator_1.default.isEmail(req.body.email)) {
                    return res.status(400).json({ message: "Correo electrónico no válido" });
                }
                if (!req.body.role) {
                    return res.status(400).json({ message: "El rol es obligatorio" });
                }
                if (req.body.password && !validator_1.default.isStrongPassword(req.body.password)) {
                    return res.status(400).json({ message: "La contraseña debe ser segura" });
                }
                if (req.body.usuario && req.body.usuario.password) {
                    var encryptedText = yield utils_1.utils.hashPassword(req.body.password);
                    req.body.password = encryptedText;
                }
                const result = yield connection_1.default.then((connection) => __awaiter(this, void 0, void 0, function* () {
                    return yield connection.query("UPDATE tbl_usuario SET ? WHERE email = ?", [updateUser, email]);
                }));
                res.json(" ha sido actualizado");
            }
            catch (error) {
                return res.status(500).json({ message: `${error.message}` });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!validator_1.default.isEmail(email)) {
                    return res.status(400).json({ message: "Correo electrónico no válido" });
                }
                // Verificar si el correo existe en la base de datos antes de eliminarlo
                const connection = yield connection_1.default;
                const user = yield connection.query('SELECT * FROM tbl_usuario WHERE email = ?', [email]);
                if (user.length === 0) {
                    return res.status(404).json({ message: "El correo electrónico no está registrado" });
                }
                const result = yield connection.query('DELETE FROM tbl_usuario WHERE email = ?', [email]);
                return res.json({ text: "Usuario con el correo " + email + " ha sido eliminado" });
            }
            catch (error) {
                return res.status(500).json({ message: `${error.message}` });
            }
        });
    }
}
exports.usuarioController = new UsuarioController();
//# sourceMappingURL=usuarioController.js.map