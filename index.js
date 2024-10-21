#!/usr/bin/env node

import AbortController from 'abort-controller';
import inquirer from 'inquirer';
import { checkAvailablePort } from './modules/checkPorts.js';
import { createProjectDirectory } from './modules/createProjectDirectory.js';
import { generateDockerCompose } from './modules/generateDockerCompose.js';
import { initGit } from './modules/initGit.js';
import { installDockerCompose } from './modules/installDockerCompose.js';

global.AbortController = AbortController;

async function run() {
  const defaultProjectName = process.argv[2] || '';

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: '¿Qué tipo de proyecto quieres crear?',
      choices: [
        '🐬 WordPress + MySQL',
        '🐬 WordPress + MariaDB'
      ]
    },
    {
      type: 'input',
      name: 'projectName',
      message: '¿Cuál es el nombre del proyecto?',
      default: defaultProjectName 
    },
    {
      type: 'input',
      name: 'userPort',
      message: '¿Qué puerto quieres usar? (por defecto se asignará un puerto aleatorio si dejas en blanco)',
      default: null
    },
    {
      type: 'confirm',
      name: 'includePhpMyAdmin',
      message: '¿Quieres añadir phpMyAdmin?',
      default: false
    },
    {
      type: 'input',
      name: 'dbPass',
      message: 'Establece una contraseña para la base de datos',
      default: 'password'
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: '¿Quieres iniciar el repositorio?',
      default: false
    }
  ]);

  const userPort = answers.userPort ? parseInt(answers.userPort) : await checkAvailablePort(3000);

  await createProjectDirectory(answers.projectName);
  await generateDockerCompose(answers.projectName, answers.projectType, userPort, answers.includePhpMyAdmin, answers.dbPass);
  await installDockerCompose(answers.projectName, userPort, answers.includePhpMyAdmin);
  if (answers.initGit){
    await initGit(answers.projectName);
  }
}

run();
