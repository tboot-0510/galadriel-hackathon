"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import Button from "../ui/Button";
import { useModalContext } from "@/context/ModalProvider";
import PremiumModal from "../modal/PremiumModal";

export default function PremiumInfo({
  estimate
}: Number) {
  const {account} = useAuth();

  const { openModal } = useModalContext();

  const openPremiumPaymentModal = () => {
    openModal({
      contentElement: <PremiumModal />,
    });
  };

  return (
    <div className="customer-info flex-1">
      Estimated premium
      <div className="flex justify-center py-3 text-4xl font-bold">
        ${Math.round(estimate)}
      </div>
      <Button
          title="Make premium payment"
          onClick={openPremiumPaymentModal}
          additionalStyle={{
            marginBottom: "12px",
            backgroundColor: "blue",
            color: "white",
          }}
        />
    </div>
  );
}
