import React from "react";
import { VaccinationCard } from "./VaccinationCard";
import { HomeVisitCard } from "./HomeVisitCard";
import { AppointmentCard } from "./AppointmentCard";

export default function ManagementCards() {
  return (
    <section className="min-h-screen bg-black p-2 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="grid grid-cols-1 gap-6">
            <HomeVisitCard />
            <VaccinationCard />
          </div>

          <AppointmentCard />
        </div>
      </div>
    </section>
  );
}