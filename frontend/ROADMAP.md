# Roadmap del Proyecto Crypto Dashboard

Este documento describe el plan de desarrollo para el proyecto Crypto Dashboard, estableciendo las prioridades y objetivos futuros basados en los requisitos del proyecto.

## Fase 1: Configuración Inicial y Estructura Básica (Completado)
- [x] Inicialización del proyecto con Remix
- [x] Configuración básica del entorno de desarrollo
- [x] Estructura de carpetas inicial
- [x] Documentación inicial (README, CHANGELOG, ROADMAP)

## Fase 2: Estructura de Carpetas y Arquitectura (Próximo)
- [ ] Definir estructura de carpetas óptima para componentes modulares
  - [ ] `/app/components`: Componentes reutilizables
    - [ ] `/app/components/cards`: Tarjetas de criptomonedas
    - [ ] `/app/components/layout`: Componentes de estructura del dashboard
    - [ ] `/app/components/ui`: Componentes UI reutilizables (botones, inputs, etc.)
  - [ ] `/app/routes`: Rutas de la aplicación
  - [ ] `/app/hooks`: Hooks personalizados
  - [ ] `/app/utils`: Utilidades y funciones auxiliares
  - [ ] `/app/services`: Servicios para llamadas a APIs
  - [ ] `/app/context`: Contextos de React (tema, estado global, etc.)
  - [ ] `/app/types`: Definiciones de TypeScript
- [ ] Configuración de Tailwind CSS para estilos consistentes
- [ ] Configuración de ESLint y Prettier para mantener la calidad del código

## Fase 3: Integración de APIs y Servicios (Semana 1)
- [ ] Investigación y documentación de la API de Coinbase
- [ ] Creación de servicios para interactuar con la API
  - [ ] Servicio para obtener lista de criptomonedas
  - [ ] Servicio para obtener tasas de cambio a USD
  - [ ] Servicio para obtener tasas de cambio a BTC
- [ ] Implementación de manejo de errores y estados de carga
- [ ] Configuración de estrategias de caché para optimizar llamadas a la API

## Fase 4: Componentes del Dashboard (Semana 1-2)
- [ ] Desarrollo de componentes para el layout principal
- [ ] Creación de componentes de tarjetas para criptomonedas
  - [ ] Diseño responsive para diferentes tamaños de pantalla
  - [ ] Visualización de nombre, símbolo y logos
  - [ ] Visualización de tasas de cambio actuales
- [ ] Implementación de la actualización de datos en tiempo real
  - [ ] Actualización en carga inicial
  - [ ] Funcionalidad de actualización manual
- [ ] Implementación de estados de carga y error visibles al usuario

## Fase 5: Funcionalidades Principales (Semana 2)
- [ ] Implementación del sistema de arrastrar y soltar para reordenar tarjetas
  - [ ] Integración de una librería de drag & drop (react-beautiful-dnd o similar)
  - [ ] Lógica para reordenar elementos en la interfaz
- [ ] Implementación del sistema de filtrado
  - [ ] Creación del componente de búsqueda/filtro
  - [ ] Lógica para filtrar por nombre o símbolo
  - [ ] UI responsiva para el filtrado

## Fase 6: Características Adicionales y Mejoras (Semana 2-3)
- [ ] Persistencia del orden de las tarjetas en localStorage
- [ ] Implementación del toggle de modo oscuro/claro
  - [ ] Contexto para gestionar el tema
  - [ ] Estilos para ambos modos
  - [ ] Persistencia de la preferencia del usuario
- [ ] Mejoras en accesibilidad y usabilidad
- [ ] Optimización de rendimiento

## Fase 7: Pruebas y Refinamiento (Semana 3)
- [ ] Implementación de pruebas unitarias para componentes clave
- [ ] Implementación de pruebas de integración para flujos principales
- [ ] Refactorización y optimización del código
- [ ] Revisión completa de la experiencia de usuario

## Fase 8: Documentación y Despliegue (Final)
- [ ] Actualización de la documentación final
  - [ ] Instrucciones detalladas de instalación y ejecución
  - [ ] Notas sobre decisiones técnicas y compensaciones
- [ ] Preparación para despliegue
- [ ] Despliegue a producción (Vercel, Netlify u otra plataforma)
- [ ] Verificación final de funcionalidad en producción 