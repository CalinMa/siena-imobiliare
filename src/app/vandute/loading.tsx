import PropertyGridSkeleton from "@/components/Skeletons/PropertyGridSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-pulse">
      {/* Title Header Skeleton */}
      <div className="bg-gray-900 py-16 px-6 relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full max-w-lg">
            <div className="h-10 md:h-12 bg-gray-600/50 rounded-xl w-3/4 mb-4"></div>
            <div className="h-5 md:h-6 bg-gray-600/50 rounded-lg w-full"></div>
          </div>
          <div className="h-12 bg-gray-600/50 rounded-full w-48"></div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-12 pb-16">
        {/* Category Filters Skeleton */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
        
        {/* Grid Section Skeleton */}
        <PropertyGridSkeleton count={6} />
      </main>
    </div>
  );
}
