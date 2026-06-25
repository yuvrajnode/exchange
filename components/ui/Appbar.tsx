"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { PrimaryButton, SuccessButton } from "@/components/ui/core/button";

export default function Appbar({ TrueButton }: { TrueButton: number }) {
  const route = usePathname();
  const router = useRouter();

  const linkClass = (active: boolean) =>
    `cursor-pointer text-sm font-medium tracking-wide transition-colors ${
      active ? "text-white" : "text-neutral-400 hover:text-white"
    }`;

  return (
    <div className="sticky top-0 z-40 mb-5 px-4 pt-4">
      <div className="nx-glass flex items-center justify-between rounded-2xl px-5 py-3">
        <div className="flex items-center gap-8 md:gap-12">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2"
            onClick={() => router.push("/")}
          >
            <Image src="/logo.svg" alt="Nexus logo" height={22} width={26} />
            <span className="text-lg font-bold tracking-wide nx-gradient-text">
              NEXUS
            </span>
          </button>

          <button
            type="button"
            className={linkClass(route.startsWith("/market"))}
            onClick={() => router.push("/market")}
          >
            Markets
          </button>
          <button
            type="button"
            className={linkClass(route.startsWith("/trade"))}
            onClick={() => router.push("/trade/SOL_USDC")}
          >
            Trade
          </button>
        </div>

        {TrueButton === 1 ? <ActionButtons /> : null}
      </div>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex items-center gap-2">
      <SuccessButton>Deposit</SuccessButton>
      <PrimaryButton>Withdraw</PrimaryButton>
    </div>
  );
}
