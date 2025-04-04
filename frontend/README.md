# Crypto Dashboard

Este proyecto es una aplicación web que muestra un dashboard de criptomonedas con datos en tiempo real de la API de Coinbase.

## Características

- Visualización de al menos 10 criptomonedas en un diseño de tarjetas responsivo
- Datos de tasas de cambio en tiempo real desde la API de Coinbase
- Reordenamiento de tarjetas mediante arrastrar y soltar
- Filtrado de criptomonedas por nombre o símbolo

## Tecnologías

- [Remix](https://remix.run)
- React
- API de Coinbase

## Desarrollo

Para iniciar el servidor de desarrollo:

```shellscript
npm run dev
```

## Despliegue

Primero, compila la aplicación para producción:

```sh
npm run build
```

Luego ejecuta la aplicación en modo producción:

```sh
npm start
```

## Estructura del Proyecto

La aplicación sigue la estructura estándar de Remix con las siguientes adiciones:

- `/app/components`: Componentes reutilizables
- `/app/routes`: Rutas de la aplicación
- `/app/utils`: Utilidades y funciones auxiliares
- `/app/styles`: Estilos CSS (Tailwind CSS)

## Testing

El proyecto utiliza Vitest y Testing Library para las pruebas unitarias y de integración:

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas con observador (modo watch)
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas para un componente específico
npm run test -- -t "Dashboard"
```

### Cobertura actual:
- Dashboard component: 83.33% de cobertura
- Se continuarán añadiendo pruebas para otros componentes (CryptoCard, SearchFilter, ThemeToggle)

### Herramientas de testing:
- Vitest: Framework de pruebas
- Testing Library: Utilidades para probar componentes de React
- vi.mock: Para simular módulos y funciones
- userEvent: Para simular interacciones del usuario

## API

La aplicación utiliza la API pública de Coinbase para obtener datos de criptomonedas en tiempo real.

# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
