import { notFound } from 'next/navigation';
import { LastVisitsSidebar } from '../../components/patient/LastVisitsSidebar';
import { DocumentsCard } from '../../components/patient/DocumentsCard';
import { MeasurementsCard } from '../../components/patient/MeasurementsCard';
import { PatientHeader } from '../../components/patient/PatientHeader';
import { PatientInfoCard } from '../../components/patient/PatientInfoCard';
import { PatientStatisticChart } from '../../components/patient/PatientStatisticChart';
import { patients } from '../../components/patient/data';
import type { PatientPageProps } from '../../components/patient/types';
import Navbar from '../../../components/Navbar';

export default function PatientDetailsPage({ params }: PatientPageProps) {
  const patient = patients.find((item) => item.id === params.id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-5 text-[#f5f5f5] md:px-6 xl:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <PatientHeader name={patient.name} />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_240px]">
              <PatientInfoCard patient={patient} />
              <MeasurementsCard measurements={patient.measurements} />
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
              <DocumentsCard documents={patient.documents} />

              <div className="rounded-2xl border border-[#26262b] bg-[#0f0f10] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#f5f5f5]">Patient Statistic</h3>

                  <button className="inline-flex items-center gap-2 rounded-xl border border-[#2c2c31] bg-[#151518] px-3 py-1.5 text-sm text-[#c9c9cf] transition hover:border-[#d04f51] hover:text-[#fab0a7]">
                    <span>Year</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <PatientStatisticChart
                  analysis={patient.visitsAnalysis}
                  visits={patient.visitsCount}
                />
              </div>
            </div>
          </div>

          <LastVisitsSidebar recentVisits={patient.recentVisits} />
        </div>
      </div>
    </div>
  );
}