
import { useUserActions } from "@/hooks/use-user-actions";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, cartTotal } = useUserActions();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">{item.type}</p>
                    <p className="font-medium">${item.price}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <p className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</p>
            <Button>Checkout</Button>
          </div>
        </>
      )}
    </div>
  );
}
