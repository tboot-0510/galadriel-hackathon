"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Wallet from "@/components/Wallet";
import Link from "next/link";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  console.log("polygonCoordinates", polygonCoordinates);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <Wallet />
        </div>
      </div>
      <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
        <Map
          position={[48.8575, 2.3514]}
          zoom={10}
          onPolygonCreated={setPolygonCoordinates}
        />
      </div>

      {polygonCoordinates && (
        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
          <Link
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
          </Link>
        </div>
      )}
    </main>
  );
}
