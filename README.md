# Maji Innovator - Frontend

Aplicación frontend desarrollada en Angular 20 con Server-Side Rendering (SSR) para el sistema de encuestas Maji Innovator.

## 🚀 Tecnologías

- **Angular 20.2.0** - Framework principal
- **Angular SSR** - Renderizado del lado del servidor
- **Bootstrap 5.3.7** - Framework CSS
- **Ng-Bootstrap 19.0.1** - Componentes Angular para Bootstrap
- **Bootstrap Icons 1.13.1** - Iconografía
- **TypeScript 5.9.2** - Lenguaje de programación
- **SCSS** - Preprocesador CSS

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- npm (viene incluido con Node.js)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd front_majiInnovator
```

2. Instala las dependencias:
```bash
npm install
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm start
```
La aplicación estará disponible en `http://localhost:4200`

### Construcción para producción
```bash
npm run build
```

### Ejecutar pruebas
```bash
npm test
```

### Servidor SSR
```bash
npm run serve:ssr:maji-innovator
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── login/           # Componente de inicio de sesión
│   ├── register/        # Componente de registro
│   ├── services/        # Servicios de la aplicación
│   │   └── auth.service.ts
│   ├── shared/          # Componentes compartidos
│   │   ├── connection-status/
│   │   └── message-alert/
│   ├── app.config.ts    # Configuración de la aplicación
│   ├── app.routes.ts    # Rutas de la aplicación
│   └── app.ts           # Componente principal
├── main.ts              # Punto de entrada del cliente
├── main.server.ts       # Punto de entrada del servidor
└── server.ts            # Configuración del servidor Express
```

## 🔧 Configuración

### Variables de Entorno
El proyecto se conecta al backend en `http://localhost:5000` por defecto. Para cambiar esta configuración, modifica el servicio de autenticación.

### CORS
El backend está configurado para aceptar peticiones desde `http://localhost:4200` y `https://localhost:4200`.

## 🎨 Características

- **Autenticación**: Sistema de login y registro
- **Responsive Design**: Interfaz adaptable a diferentes dispositivos
- **Server-Side Rendering**: Mejor rendimiento y SEO
- **Componentes Reutilizables**: Arquitectura modular
- **Alertas**: Sistema de notificaciones integrado

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run watch` - Construye y observa cambios
- `npm test` - Ejecuta las pruebas unitarias
- `npm run serve:ssr:maji-innovator` - Ejecuta la versión SSR

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.