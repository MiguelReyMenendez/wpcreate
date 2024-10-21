import fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora'; // Importar el paquete ora
import path from 'path';


export async function createProjectDirectory(projectName) {
  const projectPath = path.join(process.cwd(), projectName);
  const spinner = ora('📂 Creando el directorio del proyecto...').start(); // Iniciar loader

  // Comprobar si el directorio ya existe
  if (fs.existsSync(projectPath)) {
    console.log('\x1b[31m', `❌ El proyecto ${projectName} ya existe.`, '\x1b[0m');
    const { newName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newName',
        message: 'Introduce un nuevo nombre de proyecto:'
      }
    ]);
    return createProjectDirectory(newName);
  }

  // Crear directorios htdocs y db
  fs.mkdirSync(projectPath);
  fs.mkdirSync(path.join(projectPath, 'htdocs'));
  fs.mkdirSync(path.join(projectPath, 'db'));

  spinner.succeed(`Directorio ${projectName} creado con éxito. 🎉`);
}
