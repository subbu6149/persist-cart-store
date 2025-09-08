import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  
  const cartItem = items.find(item => item.product_id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (quantity === 0) {
      addToCart(product.id, 1);
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const categoryColors: Record<string, string> = {
    electronics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    clothing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    books: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    home: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    sports: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    beauty: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    toys: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <Badge 
            className={`absolute top-2 left-2 ${categoryColors[product.category] || 'bg-secondary'}`}
            variant="secondary"
          >
            {product.category}
          </Badge>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              Stock: {product.stock_quantity}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        {!user ? (
          <Button className="w-full" disabled>
            Sign in to purchase
          </Button>
        ) : product.stock_quantity === 0 ? (
          <Button className="w-full" disabled>
            Out of Stock
          </Button>
        ) : quantity === 0 ? (
          <Button onClick={handleAddToCart} className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrease}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold mx-4">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddToCart}
              disabled={quantity >= product.stock_quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;