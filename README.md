# Interactive Safety Simulator

An interactive web application designed to simulate various safety scenarios and educate users about emergency procedures, accident prevention, and cybersecurity awareness.

## Features

- **Accident Simulation**: Interactive scenarios for accident prevention and response
- **Cybersecurity Awareness**: Educational games and simulations for cybercrime prevention
- **Emergency Reporting**: Practice emergency reporting procedures
- **Multi-language Support**: Available in multiple languages
- **Interactive Dashboard**: Comprehensive safety management interface

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Clone or download the project
2. Navigate to the project directory:

   ```bash
   cd Interactive Safety Simulator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── AccidentSimulation.tsx
│   ├── CybercrimeGame.tsx
│   ├── Dashboard.tsx
│   ├── EmergencyReportingGame.tsx
│   └── ...
├── contexts/            # React contexts
├── data/               # Application data and scenarios
├── guidelines/         # Safety guidelines and documentation
└── styles/            # Global styles and CSS
```

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Custom component library
- **Styling**: CSS with modern features
- **State Management**: React Context API

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Ensure all code follows the project's style guidelines
2. Test your changes thoroughly
3. Submit pull requests with clear descriptions

## License

This project is proprietary software. All rights reserved.

Copyright © 2025 Interactive Safety Simulator. All rights reserved.
