# Team Game: Scaling - Project Context

## Project Overview

**Team Game: Scaling** (Командна Гра: Масштабування) is an interactive web-based discussion card game designed for team building and group discussions. Players select categories or use random card selection to reveal discussion prompts covering 7 thematic areas related to team dynamics and business growth.

### Core Features

- **7 Category Blocks**: Communication, Decision-Making, Roles & Responsibilities, Business Processes, Motivation, Scaling, Strategy
- **Special Cards**: Creative Break (Перерва на творчість) and Change of Course (Зміна курсу)
- **Multi-player Support**: 1-100+ players with turn rotation
- **Timer System**: Built-in discussion timer (1/2/3 minute presets)
- **Content Management**: Admin panel with authentication for adding/deleting categories and questions
- **Premium UI**: Glassmorphism design with animated backgrounds, 3D card flip animations, particle effects
- **Toast Notifications**: Real-time feedback for user actions

## Technology Stack

### Frontend
- **React 18.2** with functional components and hooks
- **Vite 5.1** - Build tool and dev server
- **Framer Motion 11.0** - Animations (card flips, page transitions, particles)
- **Lucide React 0.344** - Icon library
- **Vanilla CSS** - Custom styling with CSS variables, glassmorphism effects

### Backend
- **Node.js** with **Express 5.2**
- **SQLite3** - Embedded database for categories and questions (mocked in-memory for development)
- **CORS** enabled for local development

### Development Tools
- **Vitest** - Testing framework
- **Testing Library** - React component testing
- **ESLint** - Code linting with React hooks plugin
- **jsdom** - DOM environment for tests

## Project Structure

```
├── server/
│   ├── index.js          # Express API server with rate limiting & validation (port 3001)
│   └── db.js             # SQLite setup with seed data (mocked in-memory)
├── src/
│   ├── App.jsx           # Main application component (refactored)
│   ├── main.jsx          # React entry point
│   ├── index.css         # Global styles with responsive breakpoints
│   ├── components/
│   │   ├── Card.jsx      # Card component with React.memo optimization
│   │   ├── AnimatedBackground.jsx  # Animated gradient blobs
│   │   ├── Notification.jsx        # Toast notification component
│   │   ├── PlayerSetup.jsx         # Player count and name input
│   │   ├── AdminPanel.jsx          # Admin content management UI
│   │   └── ExpandedCard.jsx        # Full-screen card view
│   ├── hooks/
│   │   ├── index.js      # Hook exports
│   │   ├── useApi.js     # API request handling with error management
│   │   ├── useGameData.js # Game data fetching and CRUD operations
│   │   ├── useTimer.js   # Timer logic with audio feedback
│   │   ├── useGameLogic.js # Game state management
│   │   ├── usePlayerManagement.js # Player turn rotation
│   │   ├── useAudio.js   # Sound effects
│   │   └── useAdminAuth.js # Admin authentication
│   ├── constants/
│   │   ├── icons.js      # Icon mapping (45+ icons)
│   │   └── categories.js # Default categories, colors, presets
│   ├── data/
│   │   └── questions.js  # Static question data (backup)
│   ├── context/          # React context providers
│   ├── assets/           # Images and static assets
│   └── test/
│       ├── setup.js      # Test configuration
│       └── *.test.jsx    # Component and hook tests
├── index.html            # HTML template with Google Fonts (Outfit)
├── vite.config.js        # Vite configuration
├── vitest.config.js      # Vitest test configuration
├── .eslintrc.json        # ESLint rules for React
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables (VITE_API_URL)
```

## Building and Running

### Installation

```bash
npm install
```

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run start
```

Or run separately:

```bash
# Frontend (Vite dev server on port 5173)
npm run dev

# Backend (Express server on port 3001)
npm run server
```

### Production Build

```bash
npm run build    # Build frontend for production
npm run preview  # Preview production build
```

### Testing

```bash
npm run test         # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

### Linting

```bash
npm run lint     # Check code style
npm run lint:fix # Fix auto-fixable issues
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/questions?category=<id>` | Get questions (optionally filtered) |
| GET | `/api/health` | Health check endpoint |
| POST | `/api/categories` | Create new category (validated) |
| POST | `/api/questions` | Create new question (validated) |
| PUT | `/api/categories/:id` | Update category |
| PUT | `/api/questions/:id` | Update question |
| DELETE | `/api/categories/:id` | Delete category and its questions |
| DELETE | `/api/questions/:id` | Delete question |

### Security Features
- **Rate Limiting**: 100 requests per minute per IP
- **Input Validation**: String sanitization, color format validation, icon whitelist
- **Body Size Limit**: 10kb maximum request body
- **SQL Injection Protection**: Parameterized queries

## Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT,
  color TEXT,
  icon TEXT,
  isSpecial INTEGER DEFAULT 0
)
```

### Questions Table
```sql
CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT,
  text TEXT,
  FOREIGN KEY(category) REFERENCES categories(id)
)
```

## Development Conventions

### Code Style
- **Functional Components**: All React components use functional style with hooks
- **ES Modules**: Both frontend and backend use ES module syntax (`import`/`export`)
- **Ukrainian Language**: UI text and content are in Ukrainian
- **React.memo**: Used for performance optimization on heavy components
- **useMemo/useCallback**: Used for expensive computations and stable references

### Component Patterns
- **Custom Hooks**: Logic extracted to reusable hooks (`useGameLogic`, `useTimer`, etc.)
- **Framer Motion**: Extensive use of `motion.div`, `AnimatePresence` for animations
- **Icon Mapping**: Centralized icon mapping in `constants/icons.js`
- **Notification System**: Toast notifications via `useNotifications` hook

### CSS Architecture
- **CSS Variables**: Defined in `:root` for theming (colors, fonts, glass effects)
- **Glassmorphism**: `.glass` class for consistent frosted glass effect
- **Responsive**: Mobile-first breakpoints at 480px, 768px, 1024px
- **Animations**: Keyframe animations for skeleton loading, pulse effects, timer urgency

### Testing Practices
- **Unit Tests**: Hooks tested in isolation
- **Component Tests**: UI components tested with Testing Library
- **API Tests**: Server endpoints tested with supertest
- **Coverage Target**: 60%+ code coverage

### State Management
- Local React state (`useState`) for game state
- Custom hooks for logic separation
- Ref-based timer management (`useRef`)
- Memoized computations (`useMemo`)

## Key Design Elements

### Visual Style
- **Font**: Outfit (Google Fonts) - weights 300, 400, 600, 700
- **Background**: Dark mode with radial gradient (`#0f172a` to `#1e293b`)
- **Accent Gradient**: Blue to pink (`#3b82f6` → `#ec4899`)
- **Glass Effect**: `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(12px)`

### Animation Features
- Animated background blobs (5 gradient circles with independent motion)
- 3D card flip on selection
- Particle effects on card expansion
- Progress bar animation
- Timer pulse effect when ≤10 seconds remaining
- Confetti banner when all cards revealed
- Toast notifications with slide-down animation

## Environment Variables

```env
VITE_API_URL=http://127.0.0.1:3001
PORT=3001
```

## Default Content

The database seeds with 9 categories and 140+ questions:
- **Communication**: 20 questions
- **Decision-Making**: 20 questions
- **Roles & Responsibilities**: 20 questions
- **Business Processes**: 20 questions
- **Motivation**: 20 questions
- **Scaling**: 20 questions
- **Strategy**: 20 questions
- **Creative Break**: 15 special activity cards
- **Change of Course**: 5 rule-modifier cards

## User Flow

1. **Player Setup**: Select number of players (2-13 quick select, or manual input)
2. **Category Selection**: Choose a category or "Random Card"
3. **Card Reveal**: Click card to flip and reveal question
4. **Timer**: Optional timer start (1/2/3 minutes)
5. **Discussion**: Full-screen expanded card view with question
6. **Progress**: Track opened cards with progress bar
7. **Completion**: Confetti celebration when all cards revealed
8. **Turn Rotation**: Automatic player turn indication

## Admin Panel

**Access**: Click lock icon → Enter password (`admin123`)

Features:
- **Questions Tab**: Add questions to existing categories, view/delete by category
- **Categories Tab**: Create categories with custom name, color, icon; delete categories
- **Authentication**: Simple password-based auth (stored in localStorage)
- **Validation**: Real-time form validation with error messages

## Improvements Made (v1.0.0)

### Security
- ✅ Input validation and sanitization on server
- ✅ Rate limiting (100 req/min per IP)
- ✅ SQL injection protection via parameterized queries
- ✅ Request body size limit (10kb)
- ✅ Admin authentication

### Architecture
- ✅ Split App.jsx (668 lines) into 6 custom hooks
- ✅ Extracted constants to dedicated files
- ✅ Added React.memo for component optimization
- ✅ Added useMemo for expensive computations

### Error Handling
- ✅ Toast notification system
- ✅ API error handling with user feedback
- ✅ Form validation with error messages

### Testing
- ✅ Vitest configuration
- ✅ Testing Library setup
- ✅ Hook tests (useTimer, useGameLogic)
- ✅ Component tests (Card)
- ✅ API endpoint tests

### Code Quality
- ✅ ESLint configuration with React plugins
- ✅ React hooks linting rules
- ✅ Test scripts in package.json

## Known Limitations

1. **Admin Auth**: Simple password (not suitable for production deployment)
2. **No User Accounts**: All players share same session
3. **Single Language**: UI is in Ukrainian only
4. **No Analytics**: No usage tracking or metrics

## Future Enhancements

- [ ] WebSocket support for real-time multiplayer
- [ ] User accounts and session management
- [ ] i18n support (Ukrainian/English)
- [ ] Custom card decks
- [ ] Game statistics and history
- [ ] Export results to PDF
- [ ] Mobile app (React Native)
