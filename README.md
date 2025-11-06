# 📊 Sistema de Encuestas - Proyecto de Clase

Este es un proyecto completo de un sistema de encuestas desarrollado para una clase de programación.

## 🎯 ¿Qué hace este proyecto?

Es una aplicación web que permite:
- **Registrar usuarios** en el sistema
- **Hacer login** con usuario y contraseña
- **Responder encuestas** sobre productos
- **Ver estadísticas** (para administradores)

## 🏗️ Estructura del proyecto

Este proyecto tiene **dos partes principales**:

### 1. 🌐 Frontend (Interfaz de Usuario)
- **Carpeta**: `front_majiInnovator/`
- **Tecnología**: Angular + TypeScript
- **¿Qué hace?**: La parte que ven los usuarios (páginas web)

### 2. 📊 Backend (Servidor)
- **Carpeta**: `ms_majiInnovator/`
- **Tecnología**: C# + .NET 8
- **¿Qué hace?**: Maneja los datos y la lógica del negocio

## 🚀 Cómo ejecutar el proyecto completo

### Paso 1: Ejecutar el Backend
1. Abre Visual Studio
2. Abre el proyecto en la carpeta `ms_majiInnovator`
3. Presiona **F5** para ejecutar
4. El backend estará en `https://localhost:7166`

### Paso 2: Ejecutar el Frontend
1. Abre la terminal en la carpeta `front_majiInnovator`
2. Ejecuta: `npm install` (solo la primera vez)
3. Ejecuta: `npm start`
4. El frontend estará en `http://localhost:4200`

## 👥 Roles de usuario

### 👤 Usuario Normal
- Puede registrarse
- Puede hacer login
- Puede responder encuestas
- Puede ver su perfil

### 👨‍💼 Administrador
- Puede ver todos los usuarios
- Puede ver todas las respuestas
- Puede gestionar encuestas
- Tiene acceso a estadísticas

## 🛠️ Tecnologías utilizadas

### Frontend
- **Angular 20** - Framework web
- **Bootstrap** - Para estilos
- **TypeScript** - Lenguaje de programación

### Backend
- **C#** - Lenguaje de programación
- **.NET 8** - Framework de Microsoft
- **Entity Framework** - Para base de datos
- **SQL Server** - Base de datos

## 📋 Requisitos para ejecutar

### Para el Backend:
- Visual Studio 2022 (gratis)
- .NET 8 SDK
- SQL Server (LocalDB es suficiente)

### Para el Frontend:
- Node.js (versión 18 o superior)
- Visual Studio Code (gratis)

## 🎓 Objetivos de aprendizaje

Este proyecto enseña:
- Cómo crear una aplicación web completa
- Cómo conectar frontend con backend
- Cómo trabajar con bases de datos
- Cómo estructurar un proyecto de programación
- Patrones básicos de desarrollo

## 📁 Estructura de carpetas

```
Sistema-Encuestas/
├── front_majiInnovator/     # Frontend (Angular)
│   ├── src/app/
│   │   ├── login/           # Página de login
│   │   ├── register/        # Página de registro
│   │   ├── menu-usuario/    # Menú de usuario
│   │   ├── admin-menu/      # Menú de administrador
│   │   └── services/        # Servicios para conectar con backend
│   └── README.md
├── ms_majiInnovator/        # Backend (.NET)
│   ├── Controladores/       # Rutas de la API
│   ├── Modelos/            # Tablas de la base de datos
│   ├── DTOs/               # Datos que se envían/reciben
│   └── README.md
└── README.md               # Este archivo
```

## 🔧 Configuración importante

- **Backend**: Se ejecuta en `https://localhost:7166`
- **Frontend**: Se ejecuta en `http://localhost:4200`
- **Base de datos**: Se crea automáticamente al ejecutar el backend

## ❓ ¿Problemas comunes?

### El frontend no se conecta al backend
- Verifica que el backend esté ejecutándose
- Revisa que la URL en `auth.service.ts` sea correcta

### Error de base de datos
- Asegúrate de que SQL Server esté instalado
- Verifica la cadena de conexión en `appsettings.json`

### Error de dependencias
- En el frontend: ejecuta `npm install`
- En el backend: ejecuta `dotnet restore`

## 👨‍🏫 Para profesores

Este proyecto es ideal para enseñar:
- Arquitectura de aplicaciones web
- Separación de responsabilidades (frontend/backend)
- Trabajo con APIs REST
- Gestión de bases de datos
- Patrones de programación básicos

## 📚 Documentación adicional

- **Backend**: Ver `ms_majiInnovator/README.md`
- **Frontend**: Ver `front_majiInnovator/README.md`

## 🎉 ¡Listo para empezar!

1. Sigue las instrucciones de cada README
2. Ejecuta primero el backend, luego el frontend
3. ¡Disfruta aprendiendo programación!

cliente
usuario: 1095814976
contraseña: 1095814976

Administrador
usuario: 1098697399
contraseña: 1098697399