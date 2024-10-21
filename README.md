# Wordpress Project Starter

Este proyecto te permite crear configuraciones de WordPress utilizando Docker. Puedes elegir entre diferentes tipos de configuraciones como **MySQL** o **MariaDB**.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://bitbucket.org/simbiosys_es/wordpress-project-starter/src/develop/
   cd wordpress-project-starter
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Inicia el proceso interactivo para configurar tu proyecto:
   ```bash
   npm start
   ```

## Funcionalidades

- Creación automática de directorios para el proyecto.
- Generación automática del archivo `docker-compose.yml` con la configuración seleccionada.
- Despliegue automático de contenedores utilizando **Docker Compose**.
- Compatibilidad con **phpMyAdmin** para gestionar bases de datos de forma gráfica.


## Tipos de Proyecto

Puedes elegir entre las siguientes configuraciones para tu proyecto de WordPress:

- 🐬 **WordPress + MySQL**
- 🐬 **WordPress + MariaDB**



## Características del Despliegue

- **Chequeo de Salud para Contenedores**: 
  - La base de datos (MySQL o MariaDB) tiene un sistema de **`healthcheck`** que garantiza que esté completamente disponible antes de que WordPress intente conectarse.
  
- **Script de Espera para WordPress**:
  - WordPress utiliza un script de espera para asegurarse de que la base de datos esté lista antes de arrancar. Esto previene errores de conexión que se producen si la base de datos aún no está disponible.

- **phpMyAdmin Opcional**:
  - Puedes optar por añadir **phpMyAdmin** para gestionar tu base de datos de forma gráfica. La conexión con phpMyAdmin se configura automáticamente con las credenciales proporcionadas.

- **Política de Reinicio Automático**:
  - Los contenedores se reiniciarán automáticamente en caso de fallos, asegurando una alta disponibilidad.


## Cómo Usar

1. Al ejecutar el comando `npm start`, se te pedirá que elijas entre **MySQL** o **MariaDB**.
2. Proporciona un nombre para tu proyecto y los puertos que quieres utilizar.
3. Opcionalmente, puedes añadir **phpMyAdmin** para gestionar la base de datos.
4. Una vez configurado, el archivo `docker-compose.yml` se generará automáticamente y se lanzarán los contenedores necesarios.


## Estructura del Proyecto

- **htdocs/**: Directorio donde se almacenarán los archivos de WordPress.
- **db/**: Directorio que contiene los datos persistentes de la base de datos.
- **docker-compose.yml**: Archivo de configuración generado automáticamente que define todos los servicios necesarios para el proyecto.


## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes:

- **Docker**: [Instrucciones de instalación](https://docs.docker.com/get-docker/)
- **Docker Compose**: Generalmente incluido con Docker en versiones recientes.
- **Node.js y npm**: [Instrucciones de instalación](https://nodejs.org/)


## Notas

- **Conexiones de Base de Datos**:
  - Tanto **MySQL** como **MariaDB** utilizan un usuario predeterminado (`bn_wordpress`) con una contraseña definida durante el proceso de configuración.
  - La contraseña debe coincidir en las configuraciones de la base de datos y WordPress para evitar problemas de acceso.

- **phpMyAdmin**:
  - Si decides incluir **phpMyAdmin**, podrás acceder a través del puerto especificado (`http://localhost:<phpMyAdminPort>`).
  - El nombre de usuario y la contraseña estarán predefinidos para facilitar el acceso.


## Ejemplo de Uso

1. Ejecuta `npm start`.
2. Elige **WordPress + MariaDB**.
3. Ingresa un nombre para el proyecto, por ejemplo: `mi-proyecto-wordpress`.
4. Define los puertos que quieres utilizar.
5. El proyecto se desplegará y se generará un archivo `docker-compose.yml` con la configuración correspondiente.

Una vez desplegado, podrás acceder a:

- **WordPress**: [http://localhost:<puerto>](http://localhost:<puerto>)
- **phpMyAdmin** (si está habilitado): [http://localhost:<phpMyAdminPort>](http://localhost:<phpMyAdminPort>)


## Desarrollo Futuro

- Mejoras en la integración continua.
- Compatibilidad con otras bases de datos como PostgreSQL.
- Opciones avanzadas de configuración, como HTTPS mediante certificados SSL.
