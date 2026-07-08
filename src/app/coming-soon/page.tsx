"use client";

export default function ComingSoon() {
  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center bg-white p-12 md:p-20 rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-100 transform transition-all hover:scale-[1.02]">
        <img src="/logo.jpg" alt="Siena Imobiliare" className="h-32 md:h-40 w-auto mx-auto mb-10 object-contain drop-shadow-sm" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Site-ul este în construcție</h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-10 font-medium">Platforma va fi gata în curând. Vă mulțumim pentru răbdare!</p>
        <div className="w-24 h-2 bg-green-700 mx-auto rounded-full shadow-lg"></div>
      </div>
    </div>
  );
}
