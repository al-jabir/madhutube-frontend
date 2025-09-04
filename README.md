# MadhuTube Client

A modern YouTube-inspired video platform built with React, featuring comprehensive video management, user authentication, and real-time interactions.

## 🚀 Features

### 🎥 Video Management
- Video upload with drag-and-drop functionality
- Video player with custom controls
- Video details with like/dislike functionality
- Comment system with real-time updates
- Video search with advanced filtering
- Video recommendations

### 👤 User Authentication
- User registration and login
- Password reset functionality
- Protected routes
- JWT token-based authentication
- User profile management

### 📺 Channel Management
- Channel creation and customization
- Channel subscription system
- Subscription feed
- Channel analytics dashboard

### 🎵 Playlist Features
- Create and manage playlists
- Add/remove videos from playlists
- Playlist sharing
- Public and private playlists

### 🔍 Search & Discovery
- Advanced video search
- Filter by category, duration, upload date
- Search history
- Trending videos

### 🌙 UI/UX Features
- Dark/Light mode toggle
- Responsive design for all devices
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications

### ⚡ Real-time Features
- Live comments
- Real-time notifications
- WebSocket integration simulation

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing with protected routes
- **Vite** - Fast build tool and development server

### State Management
- **React Context** - Global state management for authentication and notifications
- **React Query** - Server state management and caching
- **React Hook Form** - Form handling and validation

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **PostCSS** - CSS processing with Tailwind plugin

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vite HMR** - Hot module replacement for development

## 📁 Project Structure

```
client/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   └── ResetPasswordForm.jsx
│   │   ├── channel/         # Channel-related components
│   │   ├── comment/         # Comment system components
│   │   ├── layout/          # Layout components (Header, Sidebar, Footer)
│   │   ├── playlist/        # Playlist management components
│   │   ├── realtime/        # Real-time features (LiveComments)
│   │   ├── subscription/    # Subscription system components
│   │   ├── ui/              # Generic UI components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── Modal.jsx
│   │   └── video/           # Video-related components
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── NotificationContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── RealTimeContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAsync.js
│   │   ├── useDebounce.js
│   │   ├── useInfiniteScroll.js
│   │   ├── useLocalStorage.js
│   │   ├── useMediaQuery.js
│   │   ├── useToggle.js
│   │   └── useClickOutside.js
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── VideoDetail.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   ├── Upload.jsx
│   │   ├── Search.jsx
│   │   ├── PlaylistDetail.jsx
│   │   └── SubscriptionFeed.jsx
│   ├── services/            # API service layer
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── videoService.js
│   │   ├── commentService.js
│   │   ├── channelService.js
│   │   ├── playlistService.js
│   │   └── subscriptionService.js
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd madhutube-app/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the client directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_REFRESH_TOKEN_URL=http://localhost:5000/api/v1/users/refresh-token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🔧 Configuration

### API Configuration
The client is configured to communicate with the backend server on port 5000:
- API Base URL: `http://localhost:5000/api/v1`
- Refresh Token URL: `http://localhost:5000/api/v1/users/refresh-token`

### Tailwind CSS
The project uses Tailwind CSS with a custom configuration that includes:
- YouTube brand colors
- Dark mode support
- Custom animations
- Responsive breakpoints

### PostCSS
PostCSS is configured with the new `@tailwindcss/postcss` plugin format for optimal performance.

## 🎨 Design System

### Colors
- **Primary**: YouTube Red (`#FF0000`)
- **Secondary**: Dark gray for backgrounds
- **Text**: Optimized for light and dark themes
- **Accent**: Blue for links and interactive elements

### Typography
- Clean, readable fonts optimized for video content
- Responsive text sizing
- Proper contrast ratios for accessibility

### Components
- Consistent spacing and sizing
- Hover effects and animations
- Loading states and error handling
- Mobile-first responsive design

## 🔐 Authentication Flow

1. **Registration**: Users can create accounts with email verification
2. **Login**: JWT-based authentication with refresh tokens
3. **Password Reset**: Secure password reset via email
4. **Protected Routes**: Automatic redirection for unauthenticated users
5. **Token Management**: Automatic token refresh and logout on expiration

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`
- Large screens: `> 1440px`

## 🎯 Key Features Implementation

### Custom Hooks
- **useLocalStorage**: Persistent state management
- **useDebounce**: Optimized search functionality
- **useInfiniteScroll**: Seamless content loading
- **useMediaQuery**: Responsive design helpers
- **useAsync**: Async operation handling

### Error Handling
- **ErrorBoundary**: React error catching
- **LoadingSpinner**: Loading state management
- **NotificationContext**: Toast notifications
- **Form Validation**: Comprehensive input validation

### Performance Optimizations
- Lazy loading for videos and images
- Debounced search queries
- Infinite scroll for large lists
- Optimized re-renders with React.memo
- Efficient state management

## 🧪 Testing

The project is set up for testing with:
- Component testing capabilities
- API service testing
- Custom hook testing
- Integration testing support

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The build artifacts will be stored in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- **Backend Server**: MadhuTube API server (port 5000)
- **Database**: MongoDB for data persistence

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

---

**MadhuTube Client** - Building the future of video sharing platforms with modern web technologies.