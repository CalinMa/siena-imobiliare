import PropertyGridSkeleton from "@/components/Skeletons/PropertyGridSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-pulse">
      {/* Hero Skeleton */}
      <section className="relative w-full h-[55vh] min-h-[400px] flex flex-col bg-gray-300 overflow-hidden">
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 w-full pt-8 md:pt-0">
          <div className="max-w-3xl w-full flex flex-col items-center">
            <div className="h-12 md:h-16 bg-gray-400/50 rounded-xl w-3/4 mb-4"></div>
            <div className="h-6 md:h-8 bg-gray-400/50 rounded-lg w-1/2 mb-8"></div>
            <div className="h-12 md:h-14 bg-gray-400/50 rounded-full w-48"></div>
          </div>
        </div>
      </section>

      {/* Grid Section Skeleton */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-8 pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
          <div className="w-full max-w-md">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-full w-40"></div>
        </div>
        
        {/* Search bar skeleton */}
        <div className="mb-10">
          <div className="h-16 bg-gray-200 rounded-full w-full max-w-2xl mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>

        <PropertyGridSkeleton count={6} />
      </main>
    </div>
  );
}
