## Contributing Instructions

### Getting Started
1. **Fork the Repository**: Create your own fork of the project on GitHub
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/your-username/Electric-Vehicle-Battery-Swapping-Kiosk-.git
   cd Electric-Vehicle-Battery-Swapping-Kiosk-
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Process
1. **Create Environment File**: Copy `.env.example` to `.env.local` and add your credentials
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Make Changes**: Implement your feature or fix
4. **Test Changes**: 
   - Run linting: `npm run lint`
   - Check TypeScript: `npm run type-check`
   - Run tests: `npm run test` (if available)
5. **Commit Changes**:
   ```bash
   git add .
   git commit -m 'Add your meaningful commit message'
   ```
6. **Push to Your Branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create Pull Request**: Go to GitHub and submit your pull request

### Code Guidelines
- Follow TypeScript best practices with strict type checking
- Use ShadCN UI components for consistent styling
- Maintain responsive design principles for all screen sizes
- Write clear, well-commented code
- Follow the existing coding style and patterns
- Use meaningful variable and function names

### Pull Request Guidelines
- **Title**: Clear and concise summary of your changes
- **Description**: Detailed explanation of what you've implemented
- **Screenshots**: Include screenshots for UI changes
- **Issues**: Reference any related issues or tickets
- **Testing**: Describe how you tested your changes
- **Base Branch**: Ensure your PR is against the correct base branch