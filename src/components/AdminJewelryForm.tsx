import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { insertJewelrySchema } from '@shared/schema';
import { Jewelry } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

// Extend the schema for validation
const formSchema = insertJewelrySchema.extend({
  price: z.preprocess(
    (val) => (val === '' ? undefined : parseFloat(val as string)),
    z.number().positive()
  ),
  features: z.string().transform(str => 
    str.split('\n').filter(line => line.trim() !== '')
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface AdminJewelryFormProps {
  jewelry?: Jewelry;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const AdminJewelryForm = ({ 
  jewelry, 
  onSubmit,
  isSubmitting 
}: AdminJewelryFormProps) => {
  const { toast } = useToast();
  const isEditing = !!jewelry;
  
  // Convert features array to string for textarea
  const featuresString = jewelry?.features ? jewelry.features.join('\n') : '';
  
  // Form default values
  const defaultValues: Partial<FormValues> = {
    name: jewelry?.name || '',
    description: jewelry?.description || '',
    imageUrl: jewelry?.imageUrl || '',
    category: jewelry?.category || '',
    price: jewelry?.price || 0,
    details: jewelry?.details || '',
    features: featuresString,
    status: jewelry?.status || 'active',
    featureVector: jewelry?.featureVector || Array(128).fill(0)
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  
  const handleSubmit = (data: FormValues) => {
    // Generate a feature vector for demo purposes
    // In a real app, this would come from an AI model
    if (!data.featureVector || data.featureVector.length === 0) {
      data.featureVector = Array.from({ length: 128 }, () => Math.random());
    }
    
    onSubmit(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Diamond Solitaire Ring" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of the jewelry item..." 
                  {...field} 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Rings" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="4250" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Details</FormLabel>
              <FormControl>
                <Input placeholder="Platinum Band, 1.2 Carat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features (one per line)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Center Stone: 1.2 carat round brilliant diamond
Metal: Platinum (950)
Band Width: 2mm
Diamond Quality: VS1 clarity, F color
Setting: 4-prong" 
                  {...field} 
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  {...field}
                >
                  <option value="active">Active</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEditing ? 'Update Jewelry' : 'Create Jewelry'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AdminJewelryForm;
