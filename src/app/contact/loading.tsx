export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-pulse">
      {/* Title Header Skeleton */}
      <div className="bg-gray-900 py-16 px-6 relative w-full overflow-hidden">
        <div className="relative z-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="h-10 md:h-12 bg-gray-600/50 rounded-xl w-64 mb-4"></div>
          <div className="h-5 md:h-6 bg-gray-600/50 rounded-lg w-96"></div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-12 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Info Skeleton */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map/Form Skeleton */}
          <div className="lg:w-2/3">
            <div className="w-full h-96 bg-gray-200 rounded-3xl mb-8"></div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
                <div className="h-14 bg-gray-200 rounded-xl w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
