import { Request, Response } from "express";
import validator from "validator";
import model from "../models/usuarioModelo";
import pool from "../utils/connection";
import { utils } from "../utils/utils";


class UsuarioController {


  public async list(req: Request, res: Response) {
    try {
        const result=await pool.then(async(connection)=>{
            return await connection.query(
                "SELECT * FROM tbl_usuario"
            )
        })

        res.json(result)
    } catch (error: any) {
        return res.status(500).json({ message: `${error.message}` });
    }
  }


  public async add(req: Request, res: Response): Promise<void> {
    try {
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({ message: "Correo electrónico no válido" });
        }

        if (!validator.isStrongPassword(req.body.password, { minLength: 8 })) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
        }

        if (!req.body.password) {
            return res.status(400).json({ message: "La contraseña debe ser llenada" });
        }

        // Validar que el rol no esté vacío
        if (!req.body.role) {
            return res.status(400).json({ message: "El rol es obligatorio" });
        }

        const encryptedText = await utils.hashPassword(req.body.password);
        if (!encryptedText) {
            return res.status(500).json({ message: "Error al cifrar la contraseña" });
        }
        
        req.body.password = encryptedText;

        const result = await pool.then(async (connection) => {
            return await connection.query('INSERT INTO tbl_usuario SET ?', req.body);
        });

        res.json({ text: "Usuario agregado" });
    } catch (error: any) {
        return res.status(500).json({ message: `${error.message}` });
    }
}





public async update(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const updateUser = req.body;

    try {

        if (req.body.email && !validator.isEmail(req.body.email)) {
            return res.status(400).json({ message: "Correo electrónico no válido" });
          }
    
          if (!req.body.role) {
            return res.status(400).json({ message: "El rol es obligatorio" });
        }

          if (req.body.password && !validator.isStrongPassword(req.body.password)) {
            return res.status(400).json({ message: "La contraseña debe ser segura" });
          }

        if (req.body.usuario && req.body.usuario.password) {
            var encryptedText = await utils.hashPassword(req.body.password);
            req.body.password = encryptedText;
        }
        

        const result = await pool.then(async (connection) => {
            return await connection.query(
                "UPDATE tbl_usuario SET ? WHERE email = ?", [updateUser, email]
            );
        });

        res.json(" ha sido actualizado" );
    } catch (error: any) {
        return res.status(500).json({ message: `${error.message}` });
    }
}


public async delete(req: Request, res: Response): Promise<any> {
    try {
        const { email } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Correo electrónico no válido" });
        }

        // Verificar si el correo existe en la base de datos antes de eliminarlo
        const connection = await pool;
        const user = await connection.query(
            'SELECT * FROM tbl_usuario WHERE email = ?',
            [email]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: "El correo electrónico no está registrado" });
        }

        const result = await connection.query(
            'DELETE FROM tbl_usuario WHERE email = ?',
            [email]
        );

        return res.json({ text: "Usuario con el correo " + email + " ha sido eliminado" });
    } catch (error: any) {
        return res.status(500).json({ message: `${error.message}` });
    }
}

}
export const usuarioController = new UsuarioController();