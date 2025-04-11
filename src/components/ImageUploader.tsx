import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Image, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ImageUploaderProps {
  onSearchResults: (results: any[]) => void;
}

export default function ImageUploader({ onSearchResults }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset the preview and error
  const resetUploader = () => {
    setPreview(null);
    setError(null);
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Store the file for upload
    setUploadFile(file);
    
    // Return a cleanup function to release the object URL
    return () => URL.revokeObjectURL(objectUrl);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });
  
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Visual search mutation
  const searchMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await fetch("/api/search/visual", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to process image search");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      onSearchResults(data);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });
  
  const handleSearch = () => {
    if (uploadFile) {
      searchMutation.mutate(uploadFile);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!preview ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed transition-colors ${
                isDragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-300 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud 
                className={`h-12 w-12 mb-4 ${
                  isDragActive ? "text-primary" : "text-gray-400"
                }`} 
              />
              <p className="text-sm font-medium mb-1">
                {isDragActive 
                  ? "Drop the image here" 
                  : "Drag and drop an image here, or click to select"
                }
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
              </p>
            </div>
            
            {error && (
              <div className="mt-3 text-sm text-red-500 text-center">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <div className="rounded-lg overflow-hidden aspect-square w-full">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                onClick={resetUploader}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={handleSearch} 
                disabled={searchMutation.isPending}
                className="w-full"
              >
                {searchMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Image className="mr-2 h-4 w-4" />
                    Find Similar Jewelry
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="mt-3 text-sm text-red-500 text-center">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}