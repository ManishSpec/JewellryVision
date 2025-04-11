import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Cart from '@/pages/Cart';
import Favorites from '@/pages/Favorites';
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { UserActionsProvider } from "@/hooks/use-user-actions";
import { ProtectedRoute } from "@/lib/protected-route";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <ProtectedRoute path="/" component={Home} />
          <ProtectedRoute path="/admin" component={Admin} requireRole="admin" />
          <ProtectedRoute path="/cart" component={Cart} />
          <ProtectedRoute path="/favorites" component={Favorites} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserActionsProvider>
          <Router />
          <Toaster />
        </UserActionsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;