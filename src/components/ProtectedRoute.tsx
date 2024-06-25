"use client";

import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { account, connectWallet } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!account) {
      router.push("/");
    }
  }, [account, router]);

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <button
          onClick={connectWallet}
          className="bg-black text-white p-4 rounded-lg"
        >
          Connect to MetaMask
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
