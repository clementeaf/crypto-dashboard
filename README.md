# Crypto Dashboard

## Description

Crypto Dashboard is a web application built with Remix and React that displays real-time cryptocurrency information using the Coinbase public API. The application allows users to view, sort, and filter cryptocurrencies in a responsive card layout. It features drag-and-drop reordering, filtering capabilities, real-time data updates, and a clean, modern UI with dark/light mode support.

## Live Demo

A live demo of the application is deployed and available at:
[https://crypto-dashboard-chi-sandy.vercel.app/](https://crypto-dashboard-chi-sandy.vercel.app/)

**Login credentials:**
- Username: `admin`
- Password: `admin`

## Key Features

### Core Requirements

- **Cryptocurrency Card Layout**: 
  - Displays 10+ popular cryptocurrencies in a responsive card-based layout
  - Each card includes the cryptocurrency's name, symbol, and current exchange rates to USD and BTC

- **Dynamic Data Fetching**:
  - Real-time exchange rate data from Coinbase API
  - Auto-update on page load with configurable intervals
  - Manual refresh option with visual indication of last update time

- **Drag & Drop Reordering**:
  - Intuitive card reordering through drag-and-drop functionality
  - Order persistence using localStorage

- **Filtering**:
  - Search input to filter cryptocurrencies by name or symbol
  - Real-time filtering with responsive UI feedback

### Bonus Features

- **Theme Support**: Toggle between dark, light, and system themes with smooth transitions
- **User Authentication**: Simple login system (credentials: admin/admin)
- **Loading & Error States**: Skeleton loading placeholders and informative error handling
- **API Diagnostics**: Tools to test connection and debug API issues
- **Cache System**: Intelligent caching to avoid API rate limiting
- **Comprehensive Test Suite**: Unit tests for components and hooks

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crypto-dashboard.git
   cd crypto-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (if necessary):
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at [ http://localhost:5173/]( http://localhost:5173/)

## Usage

### Authentication

1. When you first access the application, you'll be presented with a login screen.
2. Enter the following credentials:
   - Username: `admin`
   - Password: `admin`
3. Click the "Login" button to access the dashboard.
4. To log out, click the user icon in the top-right corner of the dashboard and select "Logout".

### Cryptocurrency Dashboard

1. After logging in, you'll see the main dashboard displaying cryptocurrency cards.
2. Each card shows:
   - Cryptocurrency name and symbol
   - Current price in USD
   - Current price in BTC
   - A visual icon representing the cryptocurrency
3. The dashboard header displays:
   - Last update time
   - Auto-refresh status
   - Filter input
   - Theme toggle
   - User menu

### Filtering Cryptocurrencies

1. Locate the search bar at the top of the dashboard.
2. Type any cryptocurrency name or symbol (e.g., "Bitcoin" or "BTC").
3. The dashboard will instantly filter to show only matching cryptocurrencies.
4. Clear the search input to show all cryptocurrencies again.

### Reordering with Drag and Drop

1. To change the order of cryptocurrency cards:
   - Click and hold on any card you wish to move.
   - Drag the card to the desired position.
   - Release the mouse button to drop the card in its new position.
2. The new order is automatically saved to localStorage and will persist between sessions.
3. When dragging, a visual indicator will show where the card will be placed.

### Toggling Dark/Light Mode

1. Find the theme toggle button in the top navigation bar (sun/moon icon).
2. Click to cycle between:
   - Light mode: Bright background with dark text
   - Dark mode: Dark background with light text
   - System mode: Follows your system preferences
3. Your theme preference is saved and will be remembered on your next visit.

### Data Updates

1. **Manual Updates**:
   - Click the "Refresh" button in the dashboard header to fetch the latest data.
   - The last update time will be refreshed to show when data was last fetched.

2. **Automatic Updates**:
   - Toggle the auto-refresh switch in the dashboard header.
   - When enabled, data will automatically refresh at regular intervals (default: every 60 seconds).
   - The timer indicator shows countdown to next refresh.

### API Diagnostics

1. Access the API diagnostics panel by clicking the "API Diagnostics" button in the dashboard sidebar.
2. The panel allows you to:
   - Test API connectivity with the "Test API" button
   - View response time and status codes
   - See detailed error messages if any issues occur
   - Clear the API cache with the "Clear Cache" button if you encounter stale data
   - View logs of recent API activity

3. If you encounter API rate limiting:
   - Click "Clear Cache" to reset stored data
   - Wait a few seconds before trying "Test API" again
   - If problems persist, the dashboard will fall back to cached data

## Technical Decisions and Trade-offs

### Authentication System
- **Decision**: Client-side authentication implementation with `sessionStorage`
- **Reason**: Simplify development for a demo without backend
- **Trade-off**: Not secure for production, but adequate for demonstration

### API Handling
- **Decision**: Cache system with 5-minute duration and delays between requests
- **Reason**: Avoid rate limiting of Coinbase's public API
- **Trade-off**: Potentially less up-to-date data in exchange for greater stability

### Drag and Drop Implementation
- **Decision**: Custom hook for drag-and-drop functionality with localStorage persistence
- **Reason**: Provide intuitive reordering with state persistence between sessions
- **Trade-off**: Added complexity in state management for better user experience

### Testing Approach
- **Decision**: Focus on component and hook unit tests
- **Reason**: Ensure reliability of core functionality
- **Trade-off**: Optimized test performance by simplifying complex test cases

## Technologies Used

- **Frontend**: Remix, React, TypeScript
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: React Hooks and Context API
- **Testing**: Vitest and React Testing Library
- **APIs**: Coinbase Public API

## Future Improvements

- Implement secure authentication with JWT and backend
- Add historical price charts with time range selection
- Allow creation of custom watchlists and portfolios
- Implement price change notifications
- Enhance test coverage with end-to-end tests

---

**Note**: This application is a demonstration and should not be used for real investment decisions. 