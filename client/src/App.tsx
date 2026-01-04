import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import AbandonedCart from "./pages/AbandonedCart";
import Legal from "./pages/Legal";
import Contact from "./pages/Contact";
import Comparison from "./pages/Comparison";
import CheckoutSuccess from "./pages/CheckoutSuccess";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/catalog"} component={Catalog} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/checkout/success"} component={CheckoutSuccess} />
      <Route path={"/account"} component={Account} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/abandoned-cart"} component={AbandonedCart} />
      <Route path={"/legal"} component={Legal} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/comparison"} component={Comparison} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <LanguageProvider>
          <CartProvider>
            <ComparisonProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </ComparisonProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );}

export default App;
