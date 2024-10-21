import { exec } from 'child_process';
import ora from 'ora'; // Importar el paquete ora
import { promisify } from 'util';

// Convertimos exec a una función que devuelve una promesa
const execAsync = promisify(exec);

export async function initGit(directory) {
    const spinner = ora('Iniciando repositorio..').start(); // Iniciar loader

    try {
        process.chdir(directory);
        await execAsync('git init');

        spinner.succeed('Repositorio Git inicializado con éxito');
    } catch (error) {
        spinner.fail('Error al inicializar el repositorio Git' + error.message);
    }
}
