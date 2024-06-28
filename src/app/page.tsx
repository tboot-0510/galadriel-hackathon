"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Wallet from "@/components/Wallet";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthProvider";
import { addLandUser } from "@/actions/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LeafletMap from "@/components/LeafletMap";

const DEFAULT_COORD = [47.59053957096499, -122.32607449034236]

export default function Home() {
  const { account } = useAuth();
  const router = useRouter();
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/LeafletMap"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const handleProceed = async () => {
    if (!account) return;
    try {
      await addLandUser({account, land: polygonCoordinates});
      router.push(`/dashboard?account=${account}`);
    } catch (e){
      console.log("e", e)
      toast.error("Error accessing dashboard");
    }
  }

  return (
    <main className="flex flex-col items-center p-24">
      <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex mb-12">
          <Wallet />
      </div>

      <Card />
      <div className="bg-white-700 mx-auto my-5 w-full h-[580px]">
        <LeafletMap
          position={DEFAULT_COORD}
          zoom={4.5}
          onPolygonCreated={setPolygonCoordinates}
        />
      </div>

      {polygonCoordinates && account && (
        <div className="mb-32 grid lg:grid-cols-4 text-center lg:mb-0 lg:w-full lg:text-left">
          {/* <Link
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            rel="noopener noreferrer"
            href={{
              pathname: "/dashboard",
              query: { coordinates: JSON.stringify(polygonCoordinates) },
            }}
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Proceed{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Save your land on chain
            </p>
          </Link> */}
          <button 
            onClick={handleProceed}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            style={{backgroundColor: "transparent", color:"black"}}
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Proceed{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Save your land on chain
            </p>
          </button>
        </div>
      )}
    </main>
  );
}
