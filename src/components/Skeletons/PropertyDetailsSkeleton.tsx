export default function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Navbar space */}
      <div className="w-full h-24 bg-white mb-8 border-b border-gray-100"></div>

      <div className="max-w-7xl mx-auto px-6 w-full pb-16">
        {/* Back link & Title Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="w-full">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded w-48"></div>
        </div>

        {/* Gallery Skeleton */}
        <div className="w-full h-[40vh] md:h-[60vh] bg-gray-200 rounded-2xl mb-6"></div>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-video bg-gray-200 rounded-xl"></div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Skeleton */}
          <div className="lg:w-2/3">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>

            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Agent Skeleton */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                  <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                  <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
