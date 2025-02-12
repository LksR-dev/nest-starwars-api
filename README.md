# Backend Nest SSR - Test (E2E)

Este proyecto es un backend desarrollado en **NestJS** que permite gestionar películas utilizando la API pública de **Star Wars**.

## 📌 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu máquina:

- **Node.js**
- **PNPM**
- **Docker**
- **Git**

## 🚀 Instalación y Ejecución Local

### 1️⃣ Clonar el repositorio

```bash
 git clone https://github.com/LksR-dev/nest-starwars-api.git
 cd nest-starwars-api
```

### 2️⃣ Instalar dependencias

```bash
 pnpm install
```

### 3️⃣ Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example` y configura los siguientes valores:

```
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=usuario
DB_PASSWORD=contraseña
DB_NAME=peliculas
```

Para levantar la base de datos de prueba:

```bash
 docker-compose up -d
```

Esto levantará un contenedor con **PostgreSQL**.

### 4️⃣ Iniciar el servidor en modo desarrollo

```bash
 pnpm run start:dev
```

El servidor estará corriendo en **http://localhost:3000**.

## 📜 Documentación de la API

La documentación se encuentra disponible en **Swagger** en la siguiente URL:

```
http://localhost:3000/api
```

## 🧪 Pruebas End-to-End

Para ejecutar las pruebas E2E, asegúrate de que el servidor esté corriendo y luego ejecuta:

```bash
 pnpm run test:e2e
```

## 📤 Despliegue

Para desplegar el proyecto en un servidor, se recomienda:

1. **Elegir un hosting con soporte para Node.js**, como:

   - **Railway.app** (gratuito y fácil de usar)
   - **Render.com**
   - **Vercel (con adaptaciones)**
   - **AWS, GCP o Heroku**

2. Configurar las variables de entorno en el servidor.
3. Instalar dependencias en producción:
   ```bash
   pnpm install --production
   ```
4. Ejecutar las migraciones en producción:
   ```bash
   pnpm run migration:run
   ```
5. Iniciar el servidor:
   ```bash
   pnpm run start:prod
   ```

## 📌 Tecnologías Utilizadas

- **NestJS** (Framework backend en Node.js)
- **PostgreSQL** (Base de datos relacional)
- **TypeORM** (ORM para manejar la base de datos)
- **JWT** (Autenticación segura)
- **Swagger** (Documentación de la API)
- **Docker** (Para facilitar la configuración de la base de datos)
- **Jest** (Pruebas unitarias y end-to-end)

## 📄 :)

Si tienes alguna consulta, no dudes en abrir un issue en el repositorio. 🚀
