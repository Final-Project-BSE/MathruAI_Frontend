"use client";

import { AppointmentCard } from "./AppointmentCard";
import DashboardFeatures from "./DashboardFeatures";

type ManagementCardsProps = {
  token: string;
  midwifeId: number;
};

export default function ManagementCards({
  token,
  midwifeId,
}: ManagementCardsProps) {
  return (
    <section className="bg-black p-2 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <AppointmentCard token={token} midwifeId={midwifeId} />
          <DashboardFeatures />
        </div>
      </div>
    </section>
  );
}