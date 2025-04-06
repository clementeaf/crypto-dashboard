# Crypto Dashboard

## Description

Crypto Dashboard is a web application that displays real-time information about cryptocurrencies using the Coinbase public API. The application includes a basic authentication system, data visualization in cards, automatic and manual information updates, and a diagnostic system to monitor the API connection.

## Key Features

- **User Authentication**: Simple login system (credentials: admin/admin)
- **Cryptocurrency Dashboard**: Visualization of up to 10 popular cryptocurrencies
- **Information per Cryptocurrency**: Prices in USD and BTC, percentage change, and more
- **Real-time Updates**: Automatic (configurable) and manual
- **Cache System**: Avoids API rate limiting
- **API Diagnostics**: Tools to test connection and debug issues
- **Responsive Interface**: Adaptable to different screen sizes

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

3. Configure environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at [http://localhost:3000](http://localhost:3000)

## Usage

1. Access with default credentials:
   - Username: `admin`
   - Password: `admin`

2. Explore the cryptocurrency dashboard
   - View current prices
   - Configure automatic updates
   - Use diagnostic tools to test the API

## Technical Decisions and Trade-offs

### Authentication System
- **Decision**: Client-side authentication implementation with `sessionStorage`
- **Reason**: Simplify development for a demo without backend
- **Trade-off**: Not secure for production, but adequate for demonstration

### API Handling
- **Decision**: Cache system and delays between requests
- **Reason**: Avoid rate limiting of Coinbase's public API
- **Trade-off**: Potentially less up-to-date data in exchange for greater stability

### Fallback Data
- **Decision**: Include static backup data when the API fails
- **Reason**: Maintain a functional user experience even with connection problems
- **Trade-off**: Possibly outdated data but always usable interface

### Responsive Design
- **Decision**: Adaptive layout with Tailwind CSS
- **Reason**: Better experience on various devices
- **Trade-off**: Greater complexity in interface development

## Technologies Used

- **Frontend**: Remix, React, TypeScript
- **Styles**: Tailwind CSS
- **APIs**: Coinbase Public API
- **Tools**: Vite, Node.js

## Future Improvements

- Implement secure authentication with JWT and backend
- Add historical price charts
- Allow creation of custom portfolios
- Implement price change notifications

---

**Note**: This application is a demonstration and should not be used for real investment decisions. 