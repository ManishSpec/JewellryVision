import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Jewelry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface UserActionsContextType {
  cart: Jewelry[];
  likedItems: number[];
  addToCart: (jewelry: Jewelry) => void;
  removeFromCart: (jewelryId: number) => void;
  toggleLike: (jewelryId: number) => void;
  isLiked: (jewelryId: number) => boolean;
  isInCart: (jewelryId: number) => boolean;
  cartTotal: number;
  cartCount: number;
}

const UserActionsContext = createContext<UserActionsContextType | null>(null);

export function UserActionsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [cart, setCart] = useState<Jewelry[]>([]);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  
  // Load cart and likes from localStorage when component mounts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("jewelry-cart");
      const savedLikes = localStorage.getItem("jewelry-likes");
      
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      
      if (savedLikes) {
        setLikedItems(JSON.parse(savedLikes));
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);
  
  // Save cart and likes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("jewelry-cart", JSON.stringify(cart));
  }, [cart]);
  
  useEffect(() => {
    localStorage.setItem("jewelry-likes", JSON.stringify(likedItems));
  }, [likedItems]);
  
  // Add an item to the cart
  const addToCart = (jewelry: Jewelry) => {
    if (!isInCart(jewelry.id)) {
      setCart((prev) => [...prev, jewelry]);
      toast({
        title: "Added to cart",
        description: `${jewelry.name} added to your cart`,
      });
    } else {
      toast({
        title: "Already in cart",
        description: `${jewelry.name} is already in your cart`,
        variant: "destructive",
      });
    }
  };
  
  // Remove an item from the cart
  const removeFromCart = (jewelryId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== jewelryId));
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart",
    });
  };
  
  // Toggle like status of an item
  const toggleLike = (jewelryId: number) => {
    if (isLiked(jewelryId)) {
      setLikedItems((prev) => prev.filter((id) => id !== jewelryId));
      toast({
        title: "Removed from favorites",
        description: "Item removed from your favorites",
      });
    } else {
      setLikedItems((prev) => [...prev, jewelryId]);
      toast({
        title: "Added to favorites",
        description: "Item added to your favorites",
      });
    }
  };
  
  // Check if an item is liked
  const isLiked = (jewelryId: number) => {
    return likedItems.includes(jewelryId);
  };
  
  // Check if an item is in the cart
  const isInCart = (jewelryId: number) => {
    return cart.some((item) => item.id === jewelryId);
  };
  
  // Calculate cart total price
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  
  // Cart item count
  const cartCount = cart.length;
  
  return (
    <UserActionsContext.Provider
      value={{
        cart,
        likedItems,
        addToCart,
        removeFromCart,
        toggleLike,
        isLiked,
        isInCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </UserActionsContext.Provider>
  );
}

export function useUserActions() {
  const context = useContext(UserActionsContext);
  if (!context) {
    throw new Error("useUserActions must be used within a UserActionsProvider");
  }
  return context;
}