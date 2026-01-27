# Electric Vehicle (EV) Battery Swapping Kiosk

## Project Purpose
The **Electric Vehicle (EV) Battery Swapping Kiosk** is a modern web application designed to revolutionize electric vehicle charging by providing a fast and efficient battery swapping service. The system addresses the limitations of traditional EV charging by allowing users to exchange discharged batteries with fully charged ones in minutes, significantly reducing downtime and promoting wider adoption of electric mobility.

## Key Features

### User Features
- **User Authentication**: Secure login and signup with Supabase authentication
- **Interactive Map**: Real-time kiosk location tracking with Leaflet maps
- **Kiosk Finder**: Search and filter nearby kiosks with battery availability
- **Battery Booking**: Reserve batteries with time slot scheduling
- **Payment Integration**: Secure payment processing through integrated payment gateway
- **User Dashboard**: Track booking history and manage account preferences
- **Responsive Design**: Mobile-first UI with ShadCN components for optimal user experience

### Admin Features
- **Admin Dashboard**: Comprehensive monitoring of all kiosk operations
- **Kiosk Management**: Add, edit, and manage kiosk locations and inventory
- **Battery Monitoring**: Real-time tracking of battery status and health
- **User Management**: Administer user accounts and view booking history
- **Analytics**: Generate reports on kiosk usage and battery swap statistics
- **Protected Routes**: Role-based access control for admin functions

### Technical Features
- **Real-Time Updates**: WebSocket-based updates for battery availability and kiosk status
- **Geolocation Services**: Integration with Leaflet for mapping and routing
- **Data Persistence**: Supabase PostgreSQL database for reliable data storage
- **Form Validation**: Zod-based validation for all user inputs
- **State Management**: React Context API for global state handling
- **Modern UI Components**: ShadCN UI library with Tailwind CSS styling
- **Charts & Visualization**: Recharts and Chart.js for data visualization

## Technologies

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 7.2.1
- **Routing**: React Router DOM 6.30.1
- **UI Library**: ShadCN UI Components
- **Styling**: Tailwind CSS 3.4.17
- **Maps**: Leaflet 1.9.4 with React-Leaflet 4.2.1
- **Charts**: Recharts 2.15.4 & Chart.js 4.5.1
- **Forms**: React Hook Form 7.61.1 with Zod validation
- **Notifications**: Sonner & Radix UI Toasts

### Backend & Database
- **Database**: Supabase (PostgreSQL) with Supabase JS SDK 2.78.0
- **Authentication**: Supabase Auth
- **Data Fetching**: TanStack React Query 5.83.0

### Development Tools
- **Linting**: ESLint 9.32.0 with TypeScript ESLint
- **Code Formatting**: Prettier (configured via ESLint)
- **Type Checking**: TypeScript 5.8.3

## Installation Steps

### Prerequisites
- Node.js 18+ (with npm or yarn)
- Git
- Supabase account (for authentication and database)
- Leaflet Maps API key (optional, for advanced map features)

### 1. Clone the Repository
```bash
git clone https://github.com/ArunArya-01/Electric-Vehicle-Battery-Swapping-Kiosk-.git
cd Electric-Vehicle-Battery-Swapping-Kiosk-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

## Usage Guidelines

### For Users
1. **Sign Up/Login**: Create an account or log in using your credentials
2. **Find Kiosks**: Use the map to locate nearby battery swapping kiosks
3. **Check Availability**: View real-time battery availability at each kiosk
4. **Book a Swap**: Select a kiosk and reserve a time slot for battery exchange
5. **Complete Swap**: Visit the kiosk at your scheduled time and scan the QR code
6. **Make Payment**: Process payment through the integrated payment gateway
7. **Track History**: View all your previous battery swap transactions in your dashboard

### For Administrators
1. **Login to Admin Panel**: Access `/admin` route with admin credentials
2. **Manage Kiosks**: Add, edit, or remove kiosk locations and update battery inventory
3. **Monitor Operations**: View real-time analytics and kiosk status
4. **Manage Users**: Administer user accounts and resolve support requests
5. **Generate Reports**: Export usage statistics and performance metrics

## Configuration Options

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_LEAFLET_API_KEY`: Optional Leaflet API key for enhanced map features

### Supabase Configuration
1. Create a new Supabase project
2. Set up the following tables:
   - `users`: User profiles and authentication data
   - `kiosks`: Kiosk locations and details
   - `batteries`: Battery inventory and status
   - `bookings`: Booking history and time slots
   - `transactions`: Payment and transaction records

3. Configure authentication providers (email/password, Google, GitHub, etc.)

## Contributing Instructions

### Getting Started
1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests (if available)
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to your branch: `git push origin feature/your-feature-name`
7. Create a pull request

### Code Guidelines
- Follow TypeScript best practices
- Use ShadCN UI components for consistency
- Maintain responsive design principles
- Write clear, commented code
- Follow the existing coding style

### Pull Request Guidelines
- Provide a clear description of your changes
- Reference any related issues
- Include screenshots of UI changes
- Ensure all tests pass

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Structure

```
src/
├── components/              # React components
│   ├── ui/                 # ShadCN UI components
│   ├── Navbar.tsx          # Navigation bar
│   ├── PaymentModal.tsx    # Payment modal
│   ├── ProtectedRoute.tsx  # Route protection
├── context/                # React context providers
│   ├── AuthContext.tsx     # Authentication context
│   ├── KioskContext.tsx    # Kiosk data context
├── hooks/                  # Custom React hooks
│   ├── use-mobile.tsx      # Mobile device detection
│   ├── use-toast.ts        # Toast notification hook
├── pages/                  # Page components
│   ├── Index.tsx           # Home page
│   ├── Kiosks.tsx          # Kiosk listing page
│   ├── KioskDetail.tsx     # Kiosk detail page
│   ├── Dashboard.tsx       # User dashboard
│   ├── Admin.tsx           # Admin dashboard
│   ├── Auth.tsx            # Authentication page
│   ├── LoginPage.tsx       # Login page
│   ├── NotFound.tsx        # 404 page
├── lib/                    # Utility functions
│   ├── utils.ts            # General utilities
├── assets/                 # Static assets
│   ├── hero-ev-swap.jpg    # Hero image
│   ├── kiosk-exterior.jpg  # Kiosk image
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## Support

For support, please:
1. Check the [Issues](../../issues) section for known problems
2. Create a new issue if your problem isn't listed
3. Contact the development team at [email@example.com]

## Roadmap

- [ ] Add support for multiple battery types
- [ ] Implement predictive battery health monitoring
- [ ] Add push notification system
- [ ] Integrate with EV charging station networks
- [ ] Implement mobile app version
- [ ] Add support for cryptocurrency payments

## Acknowledgments

- [ShadCN UI](https://ui.shadcn.com/) - Beautiful, accessible UI components
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Leaflet](https://leafletjs.com/) - Open source JavaScript map library
- [Vite](https://vitejs.dev/) - Next generation frontend tooling