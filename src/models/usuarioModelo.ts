import pool from '../utils/connection'

class UsuarioModelo {
    async findByEmail(email: string): Promise<any> {
      const connection = await pool;
      const result = await connection.query('SELECT * FROM tbl_usuario WHERE email = ?', [email]);
      return result[0]; // Suponiendo que tu consulta devuelve un array de resultados
    }


    public async add(usuario: any) {
        const result = await pool.then( async (connection) => {
            return await connection.query(
                " INSERT INTO tbl_usuario SET ? ", [usuario]);
        });
        return result;
    }


    public async update(usuario: any) {
       const update = "UPDATE tbl_usuario SET password='" + usuario.password +
            "' where email='" + usuario.email + "'";
        console.log("Update  "+ update)
        const result = await pool.then( async (connection) => {
            return await connection.query(update)              
        });
        return result;
    }


    public async delete(email: string) {
        console.log('Eliminando');
        const result = await pool.then( async (connection) => {
            return await connection.query(
             "DELETE FROM tbl_usuario where email= ?", [email]
             );
        });
        return result;
    }
}
const model = new UsuarioModelo();
export default model;
