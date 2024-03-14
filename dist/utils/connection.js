"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_mysql_1 = __importDefault(require("promise-mysql"));
const pool = promise_mysql_1.default.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'apliweb'
});
exports.default = pool;
//# sourceMappingURL=connection.js.map