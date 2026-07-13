export default function AdminSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse w-full">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 bg-gray-200 rounded w-64"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content (Table) Skeleton */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 mb-4">
                <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
                <div className="col-span-4 h-4 bg-gray-200 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
                <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
              </div>

              {/* Table Rows */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-50">
                  <div className="col-span-1 h-12 w-16 bg-gray-200 rounded"></div>
                  <div className="col-span-4 h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="col-span-2 h-6 bg-gray-200 rounded-full w-24"></div>
                  <div className="col-span-2 h-5 bg-gray-200 rounded w-16"></div>
                  <div className="col-span-2 h-4 bg-gray-200 rounded w-20"></div>
                  <div className="col-span-1 flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
