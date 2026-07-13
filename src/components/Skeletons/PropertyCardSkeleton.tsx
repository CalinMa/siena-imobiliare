export default function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-[300px] bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2 mb-6">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
        
        {/* Footer Skeleton */}
        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}