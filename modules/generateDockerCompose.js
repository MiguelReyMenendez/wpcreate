import fs from "fs";
import ora from "ora"; // Importar el paquete ora
import path from "path";
import { checkAvailablePort } from "./checkPorts.js";

export async function generateDockerCompose(projectName, projectType, userPort, includePhpMyAdmin, dbPass) {
  const projectPath = path.join(process.cwd(), projectName);
  const composeFilePath = path.join(projectPath, 'docker-compose.yml');

  let wordpressService = '';
  let dbService = '';
  let phpMyAdminService = '';
  let dbPort = await checkAvailablePort(userPort + 2);
  let phpMyAdminPort = await checkAvailablePort(userPort + 3);

  const spinner = ora('Generando Docker Compose...').start();

  let dbServiceName = ''; 
  let dbPassword = dbPass; 


  switch (projectType) {
    case '🐬 WordPress + MySQL':
      dbServiceName = 'mysql';
      wordpressService = `
        wordpress:
          image: docker.io/bitnami/wordpress-nginx:latest
          ports:
            - "${userPort}:8080"
            - "${userPort + 1}:8443"
          volumes:
            - ./htdocs:/bitnami/wordpress
          environment:
            WORDPRESS_DATABASE_HOST: ${dbServiceName}
            WORDPRESS_DATABASE_USER: bn_wordpress
            WORDPRESS_DATABASE_NAME: bitnami_wordpress
            WORDPRESS_DATABASE_PORT: ${dbPort}
            WORDPRESS_DATABASE_PASSWORD: ${dbPassword}
          depends_on:
            ${dbServiceName}:
              condition: service_healthy
          restart: always
          networks:
            - wordpress-network
        `;
      dbService = `
        mysql:
          image: docker.io/bitnami/mysql:latest
          ports:
            - "${dbPort}:3306"
          volumes:
            - ./db:/bitnami/mysql
          environment:
            MYSQL_ROOT_PASSWORD: my_root_password
            MYSQL_DATABASE: bitnami_wordpress
            MYSQL_USER: bn_wordpress
            MYSQL_PASSWORD: ${dbPassword}
          healthcheck:
            test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
            interval: 30s
            timeout: 10s
            retries: 10
          restart: always
          networks:
            - wordpress-network
      `;
      break;
    case '🐬 WordPress + MariaDB':
      dbServiceName = 'mariadb';
      wordpressService = `
        wordpress:
          image: docker.io/bitnami/wordpress-nginx:latest
          ports:
            - "${userPort}:8080"
            - "${userPort + 1}:8443"
          volumes:
            - ./htdocs:/bitnami/wordpress
          environment:
            WORDPRESS_DATABASE_HOST: ${dbServiceName}
            WORDPRESS_DATABASE_USER: bn_wordpress
            WORDPRESS_DATABASE_NAME: bitnami_wordpress
            WORDPRESS_DATABASE_PORT: ${dbPort}
            WORDPRESS_DATABASE_PASSWORD: ${dbPassword}
          depends_on:
            ${dbServiceName}:
              condition: service_healthy
          restart: always
          networks:
            - wordpress-network
      `;
      dbService = `
        mariadb:
          image: docker.io/bitnami/mariadb:latest
          ports:
            - "${dbPort}:3306"
          volumes:
            - ./db:/bitnami/mariadb
          environment:
            MARIADB_ROOT_PASSWORD: my_root_password
            MARIADB_DATABASE: bitnami_wordpress
            MARIADB_USER: bn_wordpress
            MARIADB_PASSWORD: ${dbPassword}
          healthcheck:
            test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
            interval: 30s
            timeout: 10s
            retries: 10
          restart: always
          networks:
            - wordpress-network
      `;
      break;
    default:
      spinner.fail('Tipo de proyecto no reconocido');
      return;
  }

  let services = wordpressService + dbService;

  if (includePhpMyAdmin) {
    phpMyAdminService = `
        phpmyadmin:
          image: bitnami/phpmyadmin:latest
          ports:
            - "${phpMyAdminPort}:8080"
          environment:
            PMA_HOST: '${dbServiceName}'
            PMA_USER: 'bn_wordpress'
            PMA_PASSWORD: '${dbPassword}' 
          restart: always
          networks:
            - wordpress-network
    `;
    services += phpMyAdminService;
  }

  const composeFileContent = `
services:
${services}

networks:
  wordpress-network:
    driver: bridge
`.trim();

  fs.writeFileSync(composeFilePath, composeFileContent);
  spinner.succeed(`Archivo docker-compose.yml creado en ${composeFilePath} 📂`);
}
