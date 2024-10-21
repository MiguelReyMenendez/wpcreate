import axios from 'axios';
import { exec } from 'child_process';
import ora from 'ora'; // Importar el paquete ora

export function installDockerCompose(projectDir, port, includePhpMyAdmin) {
  return new Promise((resolve, reject) => {
    const spinner = ora('Iniciando Docker Compose...').start(); // Iniciar loader
    const command = `docker compose -f docker-compose.yml up -d`;

    exec(command, { cwd: projectDir }, (error, stdout, stderr) => {
      if (error) {
        spinner.fail('Error al iniciar Docker Compose'); // Detener loader con error
        return reject(new Error(`Error al ejecutar docker compose: ${error.message}`));
      }

      if (stderr && stderr.includes("error")) {
        spinner.fail('Error en Docker Compose'); // Detener loader con error
        return reject(new Error(`Error en Docker Compose: ${stderr}`));
      }

      spinner.succeed('Docker Compose ejecutado correctamente'); // Detener loader con éxito

      const setupSpinner = ora('Configurando base de datos e instalando WordPress...').start();

      // Función para verificar si el servicio está disponible
      const checkServiceAvailable = async (url, maxRetries = 60, interval = 5000) => {
        let retries = 0;
        while (retries < maxRetries) {
          try {
            // Intentar hacer una solicitud GET
            await axios.get(url);
            return true; // Si responde, el servicio está disponible
          } catch (err) {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, interval)); // Esperar antes de intentar de nuevo
          }
        }
        return false; // Si después de los intentos no está disponible, devolver false
      };

      // Intentar conectarse al servicio de WordPress
      const wordpressUrl = `http://localhost:${port}`;
      checkServiceAvailable(wordpressUrl).then((serviceAvailable) => {
        if (serviceAvailable) {
          setupSpinner.succeed('WordPress configurado correctamente y en ejecución. 🎉');
        } else {
          setupSpinner.fail('El servicio de WordPress no está disponible después de múltiples intentos. Verifica los contenedores.');
          return reject(new Error('El servicio de WordPress no está disponible.'));
        }

        if (includePhpMyAdmin) {
          console.log(`
          ┌────────────────────────────────────────────────────────────┐
          │         🎉  ¡Tu proyecto está corriendo en:                │
          │                                                            │
          │               http://localhost:${port} 🚀                     │
          │               https://localhost:${port + 1} 🚀                   │
          │                                                            │    
          │        phpmyadmin:   http://localhost:${port + 2} 🛠️               │
          │                                                            │
          └────────────────────────────────────────────────────────────┘
          `);
        } else {
          console.log(`
          ┌────────────────────────────────────────────────────────────┐
          │         🎉  ¡Tu proyecto está corriendo en:                │
          │                                                            │
          │               http://localhost:${port} 🚀                     │
          │               https://localhost:${port + 1} 🚀                    │
          │                                                            │
          └────────────────────────────────────────────────────────────┘
          `);
        }
        
        resolve('Docker Compose se ejecutó correctamente ✅');
      });
    });
  });
}
