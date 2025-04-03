# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2023-07-11

### Añadido
- Estructura completa de carpetas optimizada para desarrollo modular
- Sistema de estilos con Tailwind CSS organizado y mantenible
  - Paleta de colores personalizada para la aplicación
  - Componentes de UI estilizados (botones, tarjetas, formularios)
  - Soporte para modo oscuro/claro
- Arquitectura para consumo de APIs y manejo de datos asíncronos
  - Tipos TypeScript para datos de criptomonedas
  - Servicios para interactuar con la API de Coinbase
  - Manejo centralizado de errores y respuestas
  - Datos de prueba para desarrollo
- Hooks personalizados para funcionalidades clave
  - `useDragSort`: Para la funcionalidad de arrastrar y soltar
  - `useFilter`: Para el filtrado de criptomonedas
- Utilidades para persistencia de datos en localStorage
- Integración con el sistema de loaders de Remix

### Cambiado
- Configuración de Tailwind para soportar temas personalizados
- Página principal para mostrar datos de criptomonedas
- ROADMAP actualizado con el progreso realizado

## [0.1.0] - 2023-07-09

### Añadido
- Inicialización del proyecto con Remix
- Configuración básica del entorno de desarrollo
- Estructura de carpetas inicial
- README actualizado con información del proyecto

### Por implementar
- Integración con API de Coinbase
- Componentes de tarjetas para criptomonedas
- Funcionalidad de arrastrar y soltar
- Filtrado de criptomonedas 