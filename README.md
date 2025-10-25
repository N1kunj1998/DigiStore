# DigiStore - Digital Products E-commerce Platform

A modern, responsive e-commerce platform for selling digital products including book summaries, video courses, and interactive workbooks.

## Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse and filter products by category (PDF summaries, video courses, workbooks)
- **Shopping Cart**: Add/remove items with real-time updates
- **Checkout Process**: Secure payment form with validation
- **Product Search**: Search across all products with filtering
- **Product Recommendations**: Related products suggestions

### 📱 User Experience
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Mobile Menu**: Collapsible navigation for mobile devices
- **Loading States**: Smooth loading indicators and transitions
- **Toast Notifications**: User feedback for all actions
- **SEO Optimized**: Meta tags and structured data

### 🎨 Modern UI/UX
- **Clean Design**: Modern, professional aesthetic
- **Interactive Elements**: Hover effects and smooth animations
- **Accessibility**: WCAG compliant components
- **Dark/Light Mode**: Theme support (ready for implementation)

### 📊 Analytics & Tracking
- **Page View Tracking**: Automatic page view analytics
- **Event Tracking**: User interaction tracking
- **Purchase Tracking**: E-commerce conversion tracking

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Context API
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd knowledge-boutique-ui-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── Hero.tsx        # Landing hero section
│   ├── ProductGrid.tsx # Product listing component
│   ├── ProductCard.tsx # Individual product card
│   └── ...
├── contexts/           # React Context providers
│   └── CartContext.tsx # Shopping cart state
├── pages/              # Route components
│   ├── Index.tsx       # Homepage
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # App entry point
```

## Key Components

### ProductGrid
Enhanced product listing with:
- Search functionality
- Price range filtering
- Sorting options
- Category filtering

### CartContext
Global state management for:
- Cart items
- Add/remove functionality
- Total calculations
- Analytics tracking

### Header
Responsive navigation with:
- Mobile menu
- Search bar
- Cart indicator
- Smooth navigation

## Customization

### Adding New Products
Edit the `products` array in `ProductGrid.tsx` and `ProductDetail.tsx`:

```typescript
{
  id: "unique-id",
  title: "Product Title",
  description: "Short description",
  fullDescription: "Detailed description",
  price: 29.99,
  type: "pdf" | "video" | "workbook",
  image: "/path/to/image.jpg"
}
```

### Styling
The project uses Tailwind CSS with custom design tokens. Modify `tailwind.config.ts` for theme customization.

### Analytics
Replace the console.log statements in `Analytics.tsx` with your preferred analytics service (Google Analytics, Mixpanel, etc.).

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Manual Deployment
1. Run `npm run build`
2. Upload the `dist` folder to your web server

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Real payment processing (Stripe, PayPal)
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Coupon system
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@digistore.com or create an issue in the repository.