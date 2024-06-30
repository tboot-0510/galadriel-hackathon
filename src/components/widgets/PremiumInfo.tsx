"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import Button from "../ui/Button";
import { useModalContext } from "@/context/ModalProvider";
import PremiumModal from "../modal/PremiumModal";
import InsureModal from "../modal/InsureModal";
import { useEffect, useState } from "react";
import { setUserPremium } from "@/actions/user";
import { getDaysInMonth, getUnixTimestamp } from "@/utils/date";

export default function PremiumInfo({
  premiumInfo
}: any) {
  const { user } = useAuth();
  const { openModal } = useModalContext();
  const [estimatedPrem, _] = useState(premiumInfo.monthly);

  const openPremiumPaymentModal = () => {
    if(user?.insuredValue) {
      openModal({
        contentElement: <PremiumModal value={premiumInfo.daily}/>,
      });
      return;
    }
    openModal({
      contentElement: <InsureModal />,
    });
  };

  useEffect(() => {
    const setUserPremiumFn = async (estimate:number) => {
      await setUserPremium({userId: user?.id, value: estimate})
    }
    if (!user) return;

    if (!user?.estimatedPremium) {
      setUserPremiumFn(premiumInfo.monthly);
      return 
    }

  }, [user, premiumInfo])

  const premiumOfTheDay = user?.premiums?.filter((premium:any) => premium.dateOfDeposit === getUnixTimestamp(new Date()))?.[0]

  return (
    <div className="flex flex-col flex-1 p-5 border border-white rounded-[25px] bg-white text-black items-center justify-center rounded-lg">
      Estimated premium / month
      <div className="flex justify-center py-3 text-4xl font-bold">
        ${Math.round(premiumInfo.monthly)}
      </div>
      Estimated premium / day
      <div className="flex justify-center py-3 text-4xl font-bold">
        ${premiumInfo.daily}
      </div>
      {!premiumOfTheDay && <Button
          title="Make premium payment"
          onClick={openPremiumPaymentModal}
          additionalStyle={{
            marginBottom: "12px",
            backgroundColor: "blue",
            color: "white",
          }}
        />
        }
    </div>
  );
}
