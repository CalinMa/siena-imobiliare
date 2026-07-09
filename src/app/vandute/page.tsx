import Link from "next/link";
import db from "@/lib/db";
import PropertyGrid from "@/components/PropertyGrid";

export const metadata = {
  title: "Proprietăți Vândute | Agenția Siena",
  description: "Istoricul proprietăților tranzacționate de Agenția Siena. Experiență și rezultate dovedite.",
};

export default async function Vandute() {
  const [rows]: any = await db.query('SELECT * FROM properties WHERE status IN ("vandut", "inchiriat", "Tranzacționată de noi", "Tranzacționată de alții") ORDER BY created_at DESC');
  const properties = rows;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Portofoliu Istoric</h1>
          <p className="text-lg text-gray-600 mb-6">Proprietăți tranzacționate cu succes în ultimii ani de echipa noastră.</p>
          <Link href="/" className="text-green-700 font-medium hover:underline">
            &larr; Înapoi la ofertele active
          </Link>
        </div>

        <PropertyGrid properties={properties} />
      </div>
    </div>
  );
}
