# Roadmap del Proyecto Crypto Dashboard

Este documento describe el plan de desarrollo para el proyecto Crypto Dashboard, estableciendo las prioridades y objetivos futuros basados en los requisitos del proyecto.

## Fase 1: Configuración Inicial y Estructura Básica (Completado)
- [x] Inicialización del proyecto con Remix
- [x] Configuración básica del entorno de desarrollo
- [x] Estructura de carpetas inicial
- [x] Documentación inicial (README, CHANGELOG, ROADMAP)

## Fase 2: Estructura de Carpetas y Arquitectura (Completado)
- [x] Definir estructura de carpetas óptima para componentes modulares
  - [x] `/app/components`: Componentes reutilizables
    - [x] `/app/components/cards`: Tarjetas de criptomonedas
    - [x] `/app/components/layout`: Componentes de estructura del dashboard
    - [x] `/app/components/ui`: Componentes UI reutilizables (botones, inputs, etc.)
  - [x] `/app/routes`: Rutas de la aplicación
  - [x] `/app/hooks`: Hooks personalizados
  - [x] `/app/utils`: Utilidades y funciones auxiliares
  - [x] `/app/services`: Servicios para llamadas a APIs
  - [x] `/app/context`: Contextos de React (tema, estado global, etc.)
  - [x] `/app/types`: Definiciones de TypeScript
- [x] Configuración de Tailwind CSS para estilos consistentes
  - [x] Organización de temas y estilos
  - [x] Configuración de paleta de colores personalizada
  - [x] Componentes estilizados con Tailwind

## Fase 3: Integración de APIs y Servicios (Completado)
- [x] Investigación y documentación de la API de Coinbase
- [x] Creación de servicios para interactuar con la API
  - [x] Servicio para obtener lista de criptomonedas
  - [x] Servicio para obtener tasas de cambio a USD
  - [x] Servicio para obtener tasas de cambio a BTC
- [x] Implementación de manejo de errores y estados de carga
- [x] Configuración de datos de prueba para desarrollo

## Fase 4: Funcionalidades Principales (En Progreso)
- [x] Implementación del sistema de arrastrar y soltar para reordenar tarjetas
  - [x] Creación de hook personalizado useDragSort
  - [x] Lógica para reordenar elementos en la interfaz
- [x] Implementación del sistema de filtrado
  - [x] Creación de hook personalizado useFilter
  - [x] Lógica para filtrar por nombre o símbolo
- [x] Persistencia del orden de las tarjetas en localStorage
- [x] Implementación del toggle de modo oscuro/claro
  - [x] Contexto para gestionar el tema
  - [x] Estilos para ambos modos
  - [x] Persistencia de la preferencia del usuario
- [ ] Integración del loader de Remix con la interfaz de usuario

## Fase 5: Componentes del Dashboard (Próximo)
- [ ] Desarrollo de componentes para el layout principal
- [ ] Creación de componentes de tarjetas para criptomonedas
  - [ ] Diseño responsive para diferentes tamaños de pantalla
  - [ ] Visualización de nombre, símbolo y logos
  - [ ] Visualización de tasas de cambio actuales
- [ ] Implementación de la actualización de datos en tiempo real
  - [ ] Actualización en carga inicial
  - [ ] Funcionalidad de actualización manual
- [ ] UI responsiva para el filtrado

## Fase 6: Mejoras y Optimizaciones (Pendiente)
- [ ] Implementación de estrategias de caché para optimizar llamadas a la API
- [ ] Mejoras en accesibilidad y usabilidad
- [ ] Optimización de rendimiento
- [ ] Ajustes finos en la experiencia de usuario

## Fase 7: Pruebas y Refinamiento (Pendiente)
- [ ] Implementación de pruebas unitarias para componentes clave
- [ ] Implementación de pruebas de integración para flujos principales
- [ ] Refactorización y optimización del código
- [ ] Revisión completa de la experiencia de usuario

## Fase 8: Documentación y Despliegue (Pendiente)
- [ ] Actualización de la documentación final
  - [ ] Instrucciones detalladas de instalación y ejecución
  - [ ] Notas sobre decisiones técnicas y compensaciones
- [ ] Preparación para despliegue
- [ ] Despliegue a producción (Vercel, Netlify u otra plataforma)
- [ ] Verificación final de funcionalidad en producción 