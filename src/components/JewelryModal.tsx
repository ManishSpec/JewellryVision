import { Jewelry } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useUserActions } from "@/hooks/use-user-actions";

interface JewelryModalProps {
  jewelry: Jewelry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JewelryModal({ jewelry, isOpen, onClose }: JewelryModalProps) {
  const userActions = useUserActions();
const { addToCart, toggleLike, isLiked, isInCart } = userActions;
  
  if (!jewelry) return null;

  // Format price to display with 2 decimal places
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(jewelry.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">{jewelry.name}</DialogTitle>
          <DialogDescription>
            {jewelry.type} • {jewelry.material}
            {jewelry.gemstone && ` • ${jewelry.gemstone}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="overflow-hidden rounded-lg">
            <img
              src={jewelry.image}
              alt={jewelry.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-semibold">{formattedPrice}</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    In Stock
                  </Badge>
                </div>
                
                {jewelry.description && (
                  <p className="text-gray-700">{jewelry.description}</p>
                )}
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Type</span>
                      <span className="text-sm">{jewelry.type}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Material</span>
                      <span className="text-sm">{jewelry.material}</span>
                    </div>
                    {jewelry.gemstone && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Gemstone</span>
                        <span className="text-sm">{jewelry.gemstone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                className="flex-1" 
                onClick={() => addToCart(jewelry)}
                disabled={isInCart(jewelry.id)}
                variant={isInCart(jewelry.id) ? "outline" : "default"}
              >
                {isInCart(jewelry.id) ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className={isLiked(jewelry.id) ? "text-red-500 hover:text-red-600" : ""}
                onClick={() => toggleLike(jewelry.id)}
              >
                <Heart className="h-4 w-4" fill={isLiked(jewelry.id) ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}