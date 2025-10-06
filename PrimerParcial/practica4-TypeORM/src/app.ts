import { AppDataSource } from "./data-source";
import { Usuario } from "./entities/index";
import { UsuarioService } from "./service/UsuarioService";


function main() {
  AppDataSource.initialize().then(async () => {
    const usuarioService = new UsuarioService(); // crea la instancia
    const usuarios = await usuarioService.findAll(); // llama al método

    console.log("✅ Conectado a SQLite");
    console.log("Usuarios:", usuarios);
  });
}
main();


