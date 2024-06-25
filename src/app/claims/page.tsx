import CustomerInfo from "../../components/widgets/CustomerInfo";
import { HourlyForecastResponse } from "@/lib/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const ClaimsPage = async ({ params, searchParams }: any) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24">
      <div className="flex w-full gap-4 md:flex-row">
        <div className="flex w-full min-w-[18rem]">
          <div className="max-w-[350px] bg-white rounded-lg p-4">Sidebar 1</div>
        </div>
        <section className="flex flex-col w-full h-full gap-4">
          <div className="flex-grow bg-white rounded-lg p-4">Sidebar 2</div>
        </section>
      </div>
    </div>
  );
};

export default ClaimsPage;
