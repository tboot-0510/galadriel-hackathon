"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Wallet from "@/components/Wallet";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/router";

const DEFAULT_COORD = [47.59053957096499, -122.32607449034236]

export default function Home() {
  const router = useRouter();
  const { account } = useAuth();
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          role: 'USER',           
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Redirect to dashboard with coordinates
        router.push({
          pathname: '/dashboard',
          query: { coordinates: JSON.stringify(polygonCoordinates) },
        });
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-24">
      <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex mb-12">
          <Wallet />
      </div>

      <Card />
      <div className="bg-white-700 mx-auto my-5 w-full h-[580px]">
        <Map
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
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            onClick={handleCreateUser}
            disabled={loading}
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Proceed{' '}
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
