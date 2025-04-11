
import { useUserActions } from "@/hooks/use-user-actions";
import { useQuery } from "@tanstack/react-query";
import { Jewelry } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import JewelryCard from "@/components/JewelryCard";

export default function Favorites() {
  const { likedItems } = useUserActions();
  
  const { data: allJewelry } = useQuery<Jewelry[]>({
    queryKey: ['/api/jewelry'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });
  
  const favoriteJewelry = allJewelry?.filter(item => likedItems.includes(item.id)) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favorites</h1>
      
      {favoriteJewelry.length === 0 ? (
        <p className="text-gray-500">No favorite items yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteJewelry.map((jewelry) => (
            <JewelryCard key={jewelry.id} jewelry={jewelry} />
          ))}
        </div>
      )}
    </div>
  );
}
