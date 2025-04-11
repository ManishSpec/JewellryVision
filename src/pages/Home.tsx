
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Jewelry } from '@shared/schema';
import ImageUploader from '@/components/ImageUploader';
import JewelryCard from '@/components/JewelryCard';
import JewelryModal from '@/components/JewelryModal';
import { getQueryFn } from '@/lib/queryClient';

export default function Home() {
  const [selectedJewelry, setSelectedJewelry] = useState<Jewelry | null>(null);
  const [searchResults, setSearchResults] = useState<Jewelry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: allJewelry, isLoading } = useQuery<Jewelry[]>({
    queryKey: ['/api/jewelry'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const handleSearchResults = (results: Jewelry[]) => {
    setSearchResults(results);
  };

  const handleJewelryClick = (jewelry: Jewelry) => {
    setSelectedJewelry(jewelry);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white">
        <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your Jewelry Experience with{' '}
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                AI Vision
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              JewelryVision revolutionizes how you discover and match fine jewelry. Our AI-powered platform helps you find the perfect piece that matches your style and preferences.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a href="#search" className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Try Now
              </a>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn More <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Advanced Technology</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to find perfect jewelry
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our AI-powered platform makes it easier than ever to discover and match jewelry pieces that perfectly align with your style.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  Visual Search Technology
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Upload an image and let our AI find similar jewelry pieces instantly.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  Premium Collection
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Curated selection of fine jewelry from trusted artisans and designers.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Competitive Pricing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Find the perfect piece within your budget with our smart pricing.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-center mb-2">
              Find Your Perfect Match
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Upload an image of jewelry you like and we'll find similar pieces in our collection
            </p>
            <ImageUploader onSearchResults={handleSearchResults} />
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Similar Items ({searchResults.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((jewelry) => (
                <JewelryCard
                  key={jewelry.id}
                  jewelry={jewelry}
                  onClick={handleJewelryClick}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Collection Section */}
      <section id="collection" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Collection</h2>
            <p className="mt-4 text-gray-600">
              Discover our handpicked selection of exquisite jewelry pieces
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allJewelry?.map((jewelry) => (
                <JewelryCard
                  key={jewelry.id}
                  jewelry={jewelry}
                  onClick={handleJewelryClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <JewelryModal
        jewelry={selectedJewelry}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
