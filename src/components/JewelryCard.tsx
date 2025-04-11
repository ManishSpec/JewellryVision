
import { Jewelry } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JewelryCardProps {
  jewelry: Jewelry & { similarityScore?: number };
  onClick: (jewelry: Jewelry & { similarityScore?: number }) => void;
}

export default function JewelryCard({ jewelry, onClick }: JewelryCardProps) {
  // Format price to display with 2 decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(jewelry.price);

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={() => onClick(jewelry)}
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={jewelry.image} 
          alt={jewelry.name} 
          className="object-cover w-full h-full hover:scale-105 transition-transform"
        />
        
        {jewelry.similarityScore !== undefined && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white">
              {Math.round(jewelry.similarityScore * 100)}% match
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1">{jewelry.name}</h3>
        
        <div className="flex justify-between items-center mt-1">
          <div className="text-sm text-gray-500">
            {jewelry.type}
          </div>
          <div className="font-medium text-primary">
            {formattedPrice}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline" className="bg-gray-100 text-xs">
            {jewelry.material}
          </Badge>
          {jewelry.gemstone && (
            <Badge variant="outline" className="bg-gray-100 text-xs">
              {jewelry.gemstone}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
