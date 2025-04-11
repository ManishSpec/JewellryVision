import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useUserActions } from "@/hooks/use-user-actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Diamond, ShoppingBag, Heart, User } from "lucide-react";

const Header = () => {
  const { user, logoutMutation } = useAuth();
  const { cartCount, likedItems } = useUserActions();
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <Diamond className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">
            Jewelry<span className="text-primary font-bold">Vision</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <div 
            className={`cursor-pointer hover:text-primary transition-colors ${
              location === "/" ? "text-primary font-medium" : "text-gray-600"
            }`}
            onClick={() => navigate("/")}
          >
            Home
          </div>
          
          {user?.role === "admin" && (
            <div 
              className={`cursor-pointer hover:text-primary transition-colors ${
                location === "/admin" ? "text-primary font-medium" : "text-gray-600"
              }`}
              onClick={() => navigate("/admin")}
            >
              Admin
            </div>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              {/* Cart Icon with Badge */}
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Button>
              </div>
              
              {/* Favorites Icon with Badge */}
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => navigate("/favorites")}>
                  <Heart className="h-5 w-5" />
                  {likedItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {likedItems.length > 9 ? '9+' : likedItems.length}
                    </span>
                  )}
                </Button>
              </div>
            </>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : location !== "/auth" && (
            <Button variant="default" onClick={() => navigate("/auth")}>
              Login
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-gray-50 border-t">
          <nav className="flex flex-col space-y-3">
            <div
              className={`px-3 py-2 rounded-md cursor-pointer ${
                location === "/" ? "bg-primary/10 text-primary font-medium" : "text-gray-600"
              }`}
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
            >
              Home
            </div>
            
            {user?.role === "admin" && (
              <div
                className={`px-3 py-2 rounded-md cursor-pointer ${
                  location === "/admin" ? "bg-primary/10 text-primary font-medium" : "text-gray-600"
                }`}
                onClick={() => {
                  navigate("/admin");
                  setMobileMenuOpen(false);
                }}
              >
                Admin
              </div>
            )}
            
            {!user && (
              <div
                className={`px-3 py-2 rounded-md cursor-pointer ${
                  location === "/auth" ? "bg-primary/10 text-primary font-medium" : "text-gray-600"
                }`}
                onClick={() => {
                  navigate("/auth");
                  setMobileMenuOpen(false);
                }}
              >
                Login / Register
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;