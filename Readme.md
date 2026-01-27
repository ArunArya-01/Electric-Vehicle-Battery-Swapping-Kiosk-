# Electric Vehicle (EV) Battery Swapping Kiosk

## Project Purpose
The **Electric Vehicle (EV) Battery Swapping Kiosk** is a modern web application designed to revolutionize electric vehicle charging by providing a fast and efficient battery swapping service. The system addresses the limitations of traditional EV charging by allowing users to exchange discharged batteries with fully charged ones in minutes, significantly reducing downtime and promoting wider adoption of electric mobility.

## Key Features

### User Features
- **User Authentication**: Secure login and signup with Supabase authentication (email/password, social providers)
- **Interactive Map**: Real-time kiosk location tracking with Leaflet maps showing user's current location and nearby kiosks
- **Kiosk Finder**: Search and filter nearby kiosks with battery availability, status, and distance information
- **Smart Kiosk Selection**: "Find Best Kiosk For Me" feature that automatically identifies the best kiosk with most available batteries
- **Battery Booking**: Reserve batteries with time slot scheduling ($5 reservation fee)
- **Direct Unlock**: Instant battery access with direct payment ($15)
- **Reservation Completion**: Complete reserved bookings with payment ($10)
- **User Dashboard**: Track booking history, total swaps, and total spending with real-time data
- **Payment Integration**: Secure payment processing through integrated payment gateway with multiple payment modes
- **Responsive Design**: Mobile-first UI with ShadCN components for optimal user experience on all devices

### Admin Features
- **Admin Dashboard**: Comprehensive monitoring of all kiosk operations with real-time analytics
- **Live Kiosk Inventory**: Visualization of available, reserved, and used batteries across all kiosks
- **Kiosk Status Tracking**: Monitor kiosk status (operational, busy, maintenance, reserved)
- **Financial Analytics**: Real-time total earnings tracking and financial reports
- **Performance Metrics**: Network capacity utilization and operational efficiency metrics
- **Data Visualization**: Bar charts for inventory, doughnut charts for status distribution, and line charts for battery level trends
- **Protected Routes**: Role-based access control for admin functions using ProtectedRoute component
- **Reservation History**: Complete audit trail of all battery swap transactions

### Technical Features

#### Real-Time Features
- **WebSocket Updates**: Supabase real-time subscriptions for instant kiosk status changes
- **Broadcast Events**: Custom `kiosk_updated` event for real-time battery and status updates
- **Task Queue System**: Frontend cron job running every 60 seconds to trigger backend processing
- **Live Data Sync**: Real-time synchronization between frontend and Supabase database

#### Supabase Integration
- **Authentication**: Email/password, social login (Google, GitHub), and JWT token management
- **Database Functions**: Edge functions for payment processing and kiosk management
- **Realtime Subscriptions**: Broadcast channels for live updates
- **RLS Policies**: Row Level Security for data protection
- **Functions**:
  - `process-payment`: Handles payment processing for reservations and unlocks
  - `run-task-queue`: Backend worker function for periodic tasks

#### Performance Optimizations
- **React Query Caching**: Efficient data fetching and caching with TanStack React Query
- **Lazy Loading**: Dynamic imports for non-critical components
- **Image Optimization**: Responsive images with lazy loading
- **Debouncing & Throttling**: Optimized event handling for maps and user interactions

#### Error Handling
- **Graceful Degradation**: Fallback behavior for geolocation and API failures
- **Error Notifications**: Toast notifications for user feedback
- **Supabase Error Handling**: Comprehensive error management for database operations
- **Session Timeout Protection**: Timeout handling for authentication requests

#### Security Features
- **Session Management**: Secure session handling with timeout checks
- **Protected Routes**: Role-based access control for admin functionality
- **Environment Variables**: Secure handling of API keys and credentials
- **Input Validation**: Zod-based validation for all user inputs

### Additional Features

#### Payment System
- **Payment Modal**: Multi-mode payment interface with interactive confirmation
- **QR Code Generation**: Dynamic QR code generation for payment verification
- **Transaction ID Input**: 6-digit transaction ID validation
- **Payment Modes**:
  - **Reserve**: $5 reservation fee with 30-second hold (demo time)
  - **Direct Unlock**: $15 immediate access fee
  - **Complete Reservation**: $10 final payment to complete booking

#### Security Features
- **Protected Routes**: Role-based access control with `ProtectedRoute` component
- **Admin Verification**: Only users with `admin` role can access admin dashboard
- **Session Management**: Secure session handling with automatic redirects
- **Loading States**: Graceful loading states during session checks

#### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: Real-time feedback for user actions
- **Interactive Maps**: Leaflet integration with location tracking
- **Dynamic Content**: Real-time updates for battery availability and kiosk status

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

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ArunArya-01/Electric-Vehicle-Battery-Swapping-Kiosk-.git
   cd Electric-Vehicle-Battery-Swapping-Kiosk-
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file in the root directory with the following:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Supabase Setup**:
   - Create a new project on [Supabase](https://supabase.com/)
   - Set up the required database tables using SQL migrations
   - Configure authentication providers
   - Create edge functions for payment processing

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   - The application will start on `http://localhost:5001`
   - Hot reload will be enabled for development

6. **Build for Production**:
   ```bash
   npm run build
   ```
   - Production files will be generated in the `dist/` directory

7. **Preview Production Build**:
   ```bash
   npm run preview
   ```

### Build Configuration

#### Vite Configuration
- **Port**: 5001 (configurable in `vite.config.ts`)
- **Host**: IPv6 enabled (`::`)
- **Path Alias**: `@/` resolves to `./src/`
- **Development Plugins**: React SWC plugin with component tagger for development

#### Tailwind CSS
- **Dark Mode**: Class-based dark mode support
- **Container**: Centered container with responsive padding
- **Colors**: Custom color system with primary, secondary, and accent colors
- **Animations**: Custom animations for accordion and interactive components

### Project Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler
- `npm run format`: Format code with Prettier (if configured)


## Usage Guidelines

### For Users

#### Getting Started
1. **Sign Up/Login**: Create an account or log in using your credentials (email/password or social login)
2. **Location Access**: Grant location permission for the best user experience

#### Finding Kiosks
1. **Browse Map**: View all available kiosks on the interactive map
2. **Filter Options**: Check battery availability, kiosk status, and distance
3. **Smart Selection**: Click "Find Best Kiosk For Me" to automatically find the optimal location
4. **View Details**: Click on any kiosk to see complete information including address, distance, and battery status

#### Booking Batteries
1. **Select Kiosk**: Choose a kiosk from the list or map
2. **Choose Payment Mode**:
   - **Reserve for Later ($5)**: Book a battery for a future time
   - **Unlock Now ($15)**: Get instant battery access
3. **Complete Payment**: Fill out payment details in the modal and confirm
4. **Receive Confirmation**: Get a toast notification with booking details

#### Completing Reservations
1. **Visit Kiosk**: Go to your selected kiosk location
2. **Authenticate**: Use your booking reference or scan the QR code
3. **Complete Swap**: Follow on-screen instructions to complete the battery exchange
4. **Payment Confirmation**: Receive digital receipt for your transaction

#### Tracking History
1. **User Dashboard**: Access your dashboard to view booking history
2. **Statistics**: Check total swaps and total spending
3. **Reservation Details**: View comprehensive information about each booking


### For Administrators

#### Dashboard Overview
1. **Login**: Access the admin panel at `/admin` with admin credentials
2. **KPI Cards**: View real-time metrics including total earnings, available batteries, operational kiosks, and network capacity
3. **Charts & Graphs**: Analyze data with interactive visualizations:
   - **Kiosk Status Distribution**: Doughnut chart showing operational, busy, maintenance, and reserved kiosks
   - **Battery Inventory**: Bar chart showing available, reserved, and used batteries per kiosk
   - **Network Capacity Trend**: Line chart showing total available batteries over time

#### Kiosk Management
1. **Monitor Status**: Real-time updates on all kiosk operations
2. **Inventory Tracking**: Track battery status and health across the network
3. **Maintenance Mode**: Temporarily mark kiosks as out of service
4. **Analytics**: Generate reports on usage patterns and performance

#### User Management
1. **View Profiles**: Access user account information
2. **Transaction History**: Review all battery swap transactions
3. **Support Requests**: Manage user inquiries and support tickets

### Advanced Features

#### QR Code Authentication (Future Implementation)
1. **Generate QR Code**: Users receive a unique QR code for each booking
2. **Scan at Kiosk**: Use the kiosk's scanner to authenticate
3. **Automated Process**: Instant battery access without manual input

#### Battery Health Monitoring
1. **Real-time Status**: Track battery health and performance metrics
2. **Charging Cycles**: Monitor battery usage and charging history
3. **Maintenance Alerts**: Automated alerts for battery maintenance needs

## Configuration Options

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_LEAFLET_API_KEY`: Optional Leaflet API key for enhanced map features

### Supabase Configuration

1. **Create Project**: Set up a new Supabase project at [supabase.com](https://supabase.com/)
2. **Database Tables**: 
   - `users`: User profiles and authentication data
   - `kiosks`: Kiosk locations, coordinates, battery inventory, and status
   - `batteries`: Battery information, health status, and charging cycles
   - `reservations`: Booking history, time slots, and payment details
   - `transactions`: Complete transaction records including payment amounts and status

3. **Table Structure**:
   ```sql
   -- Reservations table
   CREATE TABLE reservations (
     id SERIAL PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     kiosk_id INTEGER REFERENCES kiosks(id),
     status VARCHAR(255),
     user_id UUID REFERENCES auth.users(id),
     payment_amt NUMERIC(10, 2)
   );
   ```

4. **Row Level Security (RLS)**: Enable RLS for all tables and add policies:
   ```sql
   -- Allow users to read their own reservations
   CREATE POLICY "Users can read their own reservations" 
   ON reservations 
   FOR SELECT 
   USING (auth.uid() = user_id);
   ```

5. **Authentication Providers**: Configure email/password, Google, GitHub, or other authentication methods in the Supabase dashboard

### Payment System Configuration

1. **Payment Modes**:
   - **Reserve for Later**: $5 reservation fee with time slot booking
   - **Unlock Now**: $15 direct access fee
   - **Complete Reservation**: $10 final payment for reserved batteries

2. **Session Management**: Reservations are stored in sessionStorage for quick access

3. **Payment Modal**: Interactive payment interface with mode-specific messaging

### Kiosk Configuration

1. **Kiosk Statuses**:
   - `operational`: Fully functional and accepting batteries
   - `busy`: Currently processing a battery swap
   - `maintenance`: Out of service for maintenance
   - `reserved`: Has active reservations

2. **Battery Management**:
   - Available batteries: Batteries ready for use
   - Reserved batteries: Batteries booked by users
   - Total batteries: Complete inventory per kiosk

### Map Configuration

1. **Leaflet Integration**: OpenStreetMap tile layer with custom marker icons
2. **Routing**: Leaflet Routing Machine for calculating routes between user and kiosk
3. **Geolocation**: Browser's geolocation API for real-time user location tracking

### Development Tools
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier for code formatting
- **Type Checking**: TypeScript compiler
- **Build**: Vite for fast development and production builds

## Testing

### Unit Tests
- Write tests for critical functionality
- Use React Testing Library for component testing
- Test API integrations with mocking

### Integration Tests
- Test the complete flow from user login to battery swap completion
- Test payment processing and reservation management
- Test admin dashboard functionality

### End-to-End Tests
- Use Cypress or Playwright for E2E testing
- Test user journeys with real browser interactions

## Deployment

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deployment Options

#### Vercel
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with one click

#### Netlify
1. Connect your GitHub repository to Netlify
2. Configure build settings
3. Deploy automatically on every push

#### AWS Amplify
1. Connect your repository
2. Configure build settings
3. Deploy to AWS cloud infrastructure

### Environment Variables for Deployment
- `VITE_SUPABASE_URL`: Your production Supabase URL
- `VITE_SUPABASE_ANON_KEY`: Your production Supabase anonymous key

### Performance Optimization
- Enable Gzip/Brotli compression
- Configure CDN for static assets
- Optimize images and media files
- Implement lazy loading for components

### Security Considerations
- Enable HTTPS for all environments
- Secure API endpoints with proper authentication
- Implement rate limiting
- Regularly update dependencies to fix vulnerabilities

## Project Structure

```
src/
├── components/              # React components
│   ├── ui/                 # ShadCN UI components
│   │   ├── button.tsx      # Button component
│   │   ├── card.tsx        # Card component
│   │   ├── dialog.tsx      # Dialog/Modal component
│   │   ├── badge.tsx       # Badge component
│   │   ├── input.tsx       # Input component
│   │   └── ...             # Other UI components
│   ├── Navbar.tsx          # Navigation bar with user menu
│   ├── PaymentModal.tsx    # Payment modal with multiple payment modes
│   └── ProtectedRoute.tsx  # Route protection for admin routes
├── context/                # React context providers
│   ├── AuthContext.tsx     # Authentication context with Supabase integration
│   └── KioskContext.tsx    # Kiosk data context with real-time updates
├── hooks/                  # Custom React hooks
│   ├── use-mobile.tsx      # Mobile device detection
│   └── use-toast.ts        # Toast notification hook
├── integrations/           # Third-party integrations
│   └── supabase/           # Supabase client and configuration
├── lib/                    # Utility functions
│   └── utils.ts            # General utilities for styling and calculations
├── pages/                  # Page components
│   ├── Index.tsx           # Home page with hero, stats, and features
│   ├── Kiosks.tsx          # Kiosk listing with map and interactive features
│   ├── KioskDetail.tsx     # Detailed kiosk information page
│   ├── Dashboard.tsx       # User dashboard with booking history and stats
│   ├── Admin.tsx           # Admin dashboard with analytics and monitoring
│   ├── Auth.tsx            # Authentication page (login/signup)
│   ├── LoginPage.tsx       # Login page
│   └── NotFound.tsx        # 404 page
├── assets/                 # Static assets
│   ├── hero-ev-swap.jpg    # Hero image for home page
│   └── kiosk-exterior.jpg  # Kiosk exterior image for features section
├── App.css                 # Global application styles
├── App.tsx                 # Main app component with routing
├── main.tsx                # Application entry point
└── index.css               # Tailwind CSS configuration
```

## Support

### Getting Help
If you need assistance with the project, please try the following:

1. **Check Existing Issues**: Browse through existing issues in the [Issues](../../issues) section for solutions to common problems

2. **Create a New Issue**: If you encounter a problem not already documented:
   - Use a clear and descriptive title
   - Include detailed steps to reproduce the issue
   - Mention your environment (browser, OS, Node.js version)
   - Include screenshots or error messages

### Reporting Bugs
When reporting bugs, please include:
- Detailed steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or error messages
- Browser and OS information

### Feature Requests
For feature requests:
- Provide a clear description of the feature
- Explain why it would benefit the project
- Include any relevant examples or references


## Roadmap

### Current Version (v1.0.0)
- User authentication and profile management
- Interactive map with kiosk locations
- Battery reservation system
- Payment integration with multiple modes
- User dashboard with history and statistics
- Admin dashboard with analytics
- Real-time battery and kiosk status tracking

### Version 1.1.0 
- [ ] QR code authentication for kiosk access
- [ ] Battery health monitoring and diagnostics
- [ ] Push notification system for bookings
- [ ] Integration with third-party payment gateways
- [ ] Improved mobile responsiveness

### Version 1.2.0 
- [ ] Multiple battery type support
- [ ] Predictive maintenance alerts
- [ ] EV charging station network integration
- [ ] Advanced analytics and reporting
- [ ] User reviews and ratings

### Version 2.0.0
- [ ] Mobile app for iOS and Android
- [ ] Voice command integration
- [ ] Augmented reality kiosk location
- [ ] Cryptocurrency payment support
- [ ] Subscription plans and discounts

## Acknowledgments

- [ShadCN UI](https://ui.shadcn.com/) - Beautiful, accessible UI components
- [Supabase](https://supabase.com/) - Open source Firebase alternative with PostgreSQL database
- [Leaflet](https://leafletjs.com/) - Open source JavaScript map library
- [Vite](https://vitejs.dev/) - Next generation frontend build tool
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting library
- [React Router](https://reactrouter.com/) - Declarative routing for React applications
- [TanStack React Query](https://tanstack.com/query) - Powerful data fetching and caching library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Authors

- **Arun Arya** - Initial development and architecture

## Contributors

We welcome contributions from the community. See the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

