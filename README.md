# World Autistic - Web Version (Next.js)

A Next.js recreation of the World Autistic mobile app - an educational platform designed for autism support with interactive learning activities, games, and sensory experiences.

## Overview

This is a **frontend-only** implementation in Next.js with the same visual design, routes, and components as the original React Native app. All UI/UX has been rebuilt from scratch using modern web technologies.

## Features

✨ **Educational Activities**
- Math activities (12 types, 3 difficulty levels)
- Language activities (6 types)
- Interactive activity player with feedback modals

📚 **Learning Content**
- Animals, Colors, Food, Objects (with bilingual cards)
- Voice commands library
- Sound frequencies explorer

🎮 **Games**
- Memory Game with flip animations and win detection
- Extensible game framework

🌐 **Internationalization**
- Language selection (English, Portuguese, Spanish)
- Multi-language UI support

🎨 **User Interface**
- Responsive design for desktop, tablet, and mobile
- Beautiful gradient buttons and cards
- Bottom navigation bar (Home/Settings)
- Smooth animations and transitions

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** React 19
- **Routing:** App Router (file-based)
- **State Management:** React Hooks

## Project Structure

```
world-autistic-web/
├── app/
│   ├── (signin)/                 # Authentication routes
│   │   ├── page.tsx              # Landing page
│   │   ├── signIn/
│   │   └── register/
│   ├── app/                      # Main app routes
│   │   ├── layout.tsx            # App layout with navigation
│   │   ├── home/                 # Home tab
│   │   │   ├── page.tsx          # Home dashboard
│   │   │   ├── activities/       # Activity selection
│   │   │   ├── activity/         # Activity player
│   │   │   ├── animals/
│   │   │   ├── colors/
│   │   │   ├── food/
│   │   │   ├── objects/
│   │   │   ├── commands/         # Voice commands
│   │   │   ├── games/            # Game selection
│   │   │   ├── memoryGame/       # Memory game
│   │   │   ├── frequencies/      # Sound frequencies
│   │   │   └── numberLevelSelection/
│   │   └── settings/             # Settings tab
│   ├── components/               # Reusable components
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── public/                       # Static assets
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── next.config.js                # Next.js configuration
```

## Routes

### Authentication Routes
- `/(signin)` - Landing page with login/register options
- `/(signin)/signIn` - Email/password login
- `/(signin)/register` - Create new account

### Main App Routes
- `/app/home` - Home dashboard
- `/app/home/activities` - Activity selection
- `/app/home/activity` - Activity player
- `/app/home/animals` - Animal cards
- `/app/home/colors` - Color cards
- `/app/home/food` - Food cards
- `/app/home/objects` - Object cards
- `/app/home/commands` - Voice commands
- `/app/home/games` - Game selection
- `/app/home/memoryGame` - Memory game
- `/app/home/frequenciesCategorySelection` - Frequency categories
- `/app/home/frequencies` - Sound frequencies
- `/app/home/numberLevelSelection` - Number difficulty levels
- `/app/settings` - Settings page

## Components

### UI Components
- `DefaultButton` - Standard button
- `BlueButton` - Large blue button with hover effects
- `HomeCard` - Dashboard card component
- `ItemCard` - Card for animals, food, objects, colors
- `MemoryGameCard` - Flippable card for memory game
- `FrequencyCard` - Audio frequency card
- `ActivitiesButton` - Activity category button
- `Modal` - Reusable modal dialog
- `Navigation` - Bottom tab navigation

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## Styling

The project uses **Tailwind CSS** for styling with custom color schemes and animations:

- Gradient buttons with hover effects
- Card-based layouts with shadows
- Responsive grid systems
- Smooth transitions and animations
- Color-coded categories (blue, purple, green, pink, yellow, red)

## Key Features Implementation

### Activity Player
- Dynamic question display
- Multiple choice answers
- Feedback modals (correct/incorrect)
- Progress tracking with visual progress bar
- Question counter

### Memory Game
- 4-column grid layout
- Card flip animations
- Pair matching logic
- Win detection
- Game reset functionality
- Victory modal with celebration

### Navigation
- Bottom tab bar (Home/Settings)
- Active state highlighting
- Smooth transitions between routes

## Responsive Design

The app is fully responsive and works on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

Tailwind CSS breakpoints:
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px

## Future Enhancements

- [ ] Audio playback integration
- [ ] Real authentication with Firebase
- [ ] Backend API integration
- [ ] Push notifications
- [ ] User progress tracking
- [ ] More game types
- [ ] Dark mode toggle
- [ ] Accessibility improvements (WCAG)

## License

MIT

## Notes

This is a **frontend-only implementation** focused on:
- ✅ Visual design recreation
- ✅ Route structure matching
- ✅ Component organization
- ✅ Responsive UI

This does NOT include:
- ❌ Backend API integration
- ❌ Authentication logic
- ❌ Database persistence
- ❌ Audio/frequency functionality

All interactive elements are placeholder implementations for UI purposes.
