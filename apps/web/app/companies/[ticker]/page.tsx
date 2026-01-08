import { getCompanyByTicker } from "../../../lib/actions";
import { notFound } from "next/navigation";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const company = await getCompanyByTicker(ticker.toUpperCase());

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Company Details</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <span className="text-gray-600 font-semibold">Name:</span>
            <p className="text-xl mt-1">{company.name}</p>
          </div>
          <div className="mb-4">
            <span className="text-gray-600 font-semibold">Ticker:</span>
            <p className="text-xl mt-1">{company.ticker}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
