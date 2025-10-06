import { AppDataSource } from "./data-source";
import { UsuarioService } from "./service/UsuarioService";

import { seed } from "./seed/datos";

async function main() {
  // semilla
  await seed();

  // App inicial
  await AppDataSource.initialize();
  const usuarioService = new UsuarioService();
  const usuarios = await usuarioService.findAll();

  console.log("onectado a SQLite");
  console.log("Usuarios:", usuarios);


  
}

main();
