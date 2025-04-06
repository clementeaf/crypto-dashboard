# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2023-07-18

### Changed
- Optimized test suite for React hooks to improve performance
- Simplified useCryptoOrder test implementation to reduce memory consumption
- Refactored test data structures for more efficient test execution
- Combined related test cases to streamline the testing process

## [1.0.0] - 2023-07-15

### Added
- Grok3-inspired UI design system with elegant minimalist interface
- Dark/light/system theme support with smooth transitions
- Full TypeScript support with proper interfaces and types
- Comprehensive component architecture:
  - Card system for cryptocurrency display
  - Dashboard layout with responsive grid
  - Search filter with optimized UX
  - Theme toggle with system preference support
- Drag and drop reordering of cryptocurrency cards
- Auto-refresh capability with manual refresh option
- Time-since-last-update tracking
- Improved error handling and loading states

### Changed
- Complete UI redesign with modern aesthetics
- Enhanced Tailwind configuration with custom color palette and components
- Refactored component structure for better maintainability
- Improved search filter with debounced input
- Optimized loading states with skeleton placeholders

### Fixed
- Type safety issues in cryptocurrency interfaces
- Dark mode inconsistencies
- Search filter edge cases
- Component organization for better code splitting

## [0.2.0] - 2023-07-11

### Added
- Complete folder structure optimized for modular development
- Styling system with organized and maintainable Tailwind CSS
  - Custom color palette for the application
  - Styled UI components (buttons, cards, forms)
  - Dark/light mode support
- Architecture for API consumption and asynchronous data handling
  - TypeScript types for cryptocurrency data
  - Services for interacting with the Coinbase API
  - Centralized error and response handling
  - Test data for development
- Custom hooks for key functionalities
  - `useDragSort`: For drag and drop functionality
  - `useFilter`: For cryptocurrency filtering
- Utilities for data persistence in localStorage
- Integration with Remix loader system

### Changed
- Tailwind configuration to support custom themes
- Main page to display cryptocurrency data
- Updated ROADMAP with progress made

## [0.1.0] - 2023-07-09

### Added
- Project initialization with Remix
- Basic development environment setup
- Initial folder structure
- README updated with project information

### Pending
- Coinbase API integration
- Cryptocurrency card components
- Drag and drop functionality
- Cryptocurrency filtering 