import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '../lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Jewelry } from '@shared/schema';
import AdminJewelryForm from '@/components/AdminJewelryForm';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJewelry, setSelectedJewelry] = useState<Jewelry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive"
      });
      setLocation('/');
    } else if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation, toast]);

  // Fetch all jewelry
  const { data: jewelry, isLoading } = useQuery({
    queryKey: ['/api/jewelry'],
  });
  
  // Calculate pagination
  const totalPages = jewelry ? Math.ceil(jewelry.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJewelry = jewelry ? jewelry.slice(startIndex, endIndex) : [];
  
  // Create jewelry mutation
  const { mutate: createJewelry, isPending: isCreating } = useMutation({
    mutationFn: async (jewelryData: any) => {
      const response = await apiRequest('POST', '/api/jewelry', jewelryData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jewelry'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Jewelry item created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create jewelry item",
        variant: "destructive"
      });
    }
  });
  
  // Update jewelry mutation
  const { mutate: updateJewelry, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const response = await apiRequest('PUT', `/api/jewelry/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jewelry'] });
      setIsEditDialogOpen(false);
      setSelectedJewelry(null);
      toast({
        title: "Success",
        description: "Jewelry item updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update jewelry item",
        variant: "destructive"
      });
    }
  });
  
  // Delete jewelry mutation
  const { mutate: deleteJewelry, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/jewelry/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jewelry'] });
      setIsDeleteDialogOpen(false);
      setSelectedJewelry(null);
      toast({
        title: "Success",
        description: "Jewelry item deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete jewelry item",
        variant: "destructive"
      });
    }
  });
  
  const handleEditClick = (jewelry: Jewelry) => {
    setSelectedJewelry(jewelry);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (jewelry: Jewelry) => {
    setSelectedJewelry(jewelry);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCreateSubmit = (data: any) => {
    createJewelry(data);
  };
  
  const handleUpdateSubmit = (data: any) => {
    if (selectedJewelry) {
      updateJewelry({ id: selectedJewelry.id, data });
    }
  };
  
  const handleDeleteConfirm = () => {
    if (selectedJewelry) {
      deleteJewelry(selectedJewelry.id);
    }
  };
  
  // If not admin, don't render the page
  if (user && user.role !== 'admin') {
    return null;
  }
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold_out':
        return 'bg-red-100 text-red-800';
      case 'discontinued':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-2xl">Admin Panel: Jewelry Catalog</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add New Item</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Jewelry Item</DialogTitle>
              </DialogHeader>
              <AdminJewelryForm 
                onSubmit={handleCreateSubmit} 
                isSubmitting={isCreating}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Admin Table */}
        <div className="overflow-x-auto bg-white rounded-lg border">
          <Table>
            <TableCaption>
              {isLoading ? 'Loading jewelry inventory...' : 'A list of all jewelry items in your inventory.'}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Loading jewelry items...</p>
                  </TableCell>
                </TableRow>
              ) : currentJewelry.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="mt-2 text-gray-500">No jewelry items found.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      Add Your First Item
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                currentJewelry.map((item: Jewelry) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">SKU: JWL-{item.id.toString().padStart(4, '0')}</div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {item.category}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${item.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClick(item)}
                        >
                          <Pencil className="h-4 w-4 text-primary" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Jewelry Item</DialogTitle>
          </DialogHeader>
          {selectedJewelry && (
            <AdminJewelryForm 
              jewelry={selectedJewelry}
              onSubmit={handleUpdateSubmit}
              isSubmitting={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the jewelry item
              "{selectedJewelry?.name}" from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default Admin;
