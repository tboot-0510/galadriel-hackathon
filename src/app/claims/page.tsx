"use client"
import { Suspense, useEffect, useState } from "react";
import { getClaims } from "@/actions/claims/index";
import { useDebounce } from "@uidotdev/usehooks";
import ClaimMessage from "@/components/widgets/ClaimMessage";
import { HiUser } from "react-icons/hi";
import { useAuth } from "@/context/AuthProvider";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

const ClaimsPage = ({ params, searchParams }: any) => {
  const {account} = useAuth();
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const router = useRouter();

  const id = searchParams.id;

  useEffect(() => {
    const getUserClaims = async () => {
      const {claims} = await getClaims(account);
      setClaims(claims);
      const initialClaim = claims.filter((claim:any) => claim.id === Number(id))[0] || claims[0];
      setSelectedClaim(initialClaim);
    }

    if (account) {
      getUserClaims();
    }
    
  }, [account])

  const handleClaimClick = (claim:any) => {
    setSelectedClaim(claim);
    router.push(`/claims?id=${claim.id}`);
  };

  const debouncedSearchTerm = useDebounce(selectedClaim?.transactionHash, 800);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24">
      <div className="flex w-full gap-4 md:flex-row">
        <div className="h-full w-[350px] bg-white rounded-lg p-4">
          {claims?.map((claim:any, idx:number) => (
            <div key={idx} className={`group rounded-md border px-5 py-4 transition-colors ${selectedClaim?.id === claim.id ? 'border-gray-300 bg-black text-white' : 'hover:border-gray-300 bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'}`} onClick={() => handleClaimClick(claim)}>
              Claim #{claim.id}
            </div>
          ))}
          
        </div>
        <section className="flex flex-col w-full h-full gap-4">
          <div className="flex-grow bg-white rounded-lg p-4">
            <div className="flex flex-row mb-5 text-black">
              <div className="flex items-center justify-center inline-block h-8 w-8 rounded-full ring-2 ring-white mr-4 min-w-[32px]" style={{backgroundColor:"#003C68", borderRadius: "50%"}}>
                <HiUser className="size-4" color="white"/>
              </div>
              
              {selectedClaim?.description}
            </div>
            <ClaimMessage tx={debouncedSearchTerm}/>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClaimsPage;
