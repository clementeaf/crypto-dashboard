# Crypto Dashboard

Aplicación web que muestra un dashboard de criptomonedas con datos en tiempo real de la API de Coinbase.

## Estructura del Proyecto

- `/frontend`: Aplicación Remix para el frontend
  - Consulta `/frontend/README.md` para más detalles sobre el desarrollo

## Características

- Visualización de al menos 10 criptomonedas en un diseño de tarjetas responsivo
- Datos de tasas de cambio en tiempo real desde la API de Coinbase
- Reordenamiento de tarjetas mediante arrastrar y soltar
- Filtrado de criptomonedas por nombre o símbolo

## Tecnologías

- [Remix](https://remix.run)
- React
- API de Coinbase
- Tailwind CSS

## Instalación

1. Clona este repositorio
```bash
git clone https://github.com/clementeaf/crypto-dashboard.git
cd crypto-dashboard
```

2. Instala las dependencias del frontend
```bash
cd frontend
npm install
```

3. Inicia el servidor de desarrollo
```bash
npm run dev
```

## Documentación

Para más información, consulta:
- [CHANGELOG.md](frontend/CHANGELOG.md) - Historial de cambios
- [ROADMAP.md](frontend/ROADMAP.md) - Plan de desarrollo 