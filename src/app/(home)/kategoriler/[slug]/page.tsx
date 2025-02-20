"use client"
import { useEffect, useState } from "react";
import { getCategoryWithConsultants } from "./actions";
import ConsultantSection from "@/components/ConsultantSection";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getCategoryWithConsultants(params.slug as string);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Kategori bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{data.category.title}</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bu Kategorideki Danışmanlar</h2>
        <ConsultantSection consultants={data.consultants} />
      </div>
    </div>
  );
}
