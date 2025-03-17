"use client"
import { useEffect, useState } from "react";
import { getSearchResults } from "./[slug]/actions";
import ConsultantSectionForSearch from "@/components/ConsultantSectionForSearch";
import Loading from "@/components/Loading";
import { useParams, useSearchParams } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default function CategoryPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get all filter parameters
        const filters = {
          keyword: params.slug as string,
          minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
          maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
          gender: searchParams.get('gender') || undefined,
          languages: searchParams.get('languages') ? searchParams.get('languages')!.split(',') : undefined
        };
        
        const data = await getSearchResults(filters);
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug, searchParams]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
     {params.slug && <h1 className="text-3xl font-bold mb-6">"{params.slug}" için arama sonuçları</h1>}
      
      <div className="mb-8">
        <ConsultantSectionForSearch consultants={data.consultants} />
      </div>
    </div>
  );
}
