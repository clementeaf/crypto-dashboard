# Crypto Dashboard

A modern cryptocurrency dashboard that displays real-time data with a sleek Grok3-inspired design.

## Overview

This project showcases a responsive dashboard for monitoring cryptocurrency prices, market caps, and trends. The intuitive interface allows users to track major cryptocurrencies, filter results, and customize their viewing experience.

## Project Structure

- `/frontend`: Remix application for the frontend
  - See `/frontend/README.md` for more details about development

## Features

- Real-time cryptocurrency data display with elegant card design
- Responsive layout optimized for all device sizes
- Dark/light/system theme support with smooth transitions
- Drag-and-drop reordering of cryptocurrency cards
- Search filtering by name or symbol
- Auto-refresh capability with manual refresh option
- Time-since-last-update tracking

## Technologies

- [Remix](https://remix.run) for server-rendered React applications
- TypeScript for type safety
- Tailwind CSS for styling with custom design system
- Modern hooks-based React architecture
- Web APIs for drag-and-drop functionality

## Design

The UI features a Grok3-inspired design system with:
- Clean, minimalist interface with purposeful animations
- Elegant card components with hover effects
- Custom color scheme with primary accent colors
- Consistent spacing and typography
- Responsive design principles

## Installation

1. Clone this repository
```bash
git clone https://github.com/clementeaf/crypto-dashboard.git
cd crypto-dashboard
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Start the development server
```bash
npm run dev
```

## Usage

- Use the search box to filter cryptocurrencies
- Toggle between light/dark/system theme with the theme switcher
- Click "Refresh" to update data manually or enable "Auto" for automatic updates
- Drag and drop cards to reorder them according to your preference
- View detailed price information, market cap, and 24h volume for each cryptocurrency

## Documentation

For more information, check:
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [ROADMAP.md](ROADMAP.md) - Development roadmap

## License

MIT License - See LICENSE file for details 