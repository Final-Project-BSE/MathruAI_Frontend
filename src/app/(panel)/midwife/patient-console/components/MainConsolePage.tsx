'use client';

import { useRouter } from 'next/navigation';
import { Search, Plus, MoreVertical, Filter } from 'lucide-react';

type Patient = {
  id: string;
  name: string;
  gender: 'M' | 'F';
  patientId: string;
  phone: string;
  lastAppointment: string;
  doctor: string;
  reason: string;
  avatar: string;
};

const patients: Patient[] = [
  {
    id: 'anna-w-farc',
    name: 'Anna W. Abarca',
    gender: 'F',
    patientId: '15321904',
    phone: '972-810-1206',
    lastAppointment: '04/15/2020 10:00 AM',
    doctor: 'Dr. Carlos Murphy',
    reason: 'General health checkup',
    avatar: 'A',
  },
  {
    id: 'aron-h-martin',
    name: 'Aron H. Martin',
    gender: 'M',
    patientId: '16489758',
    phone: '925-236-4144',
    lastAppointment: '04/15/2020 11:30 AM',
    doctor: 'Dr. Carl Daniels',
    reason: 'Cholesterol problems',
    avatar: 'A',
  },
  {
    id: 'branden-m-greer',
    name: 'Branden M. Greer',
    gender: 'M',
    patientId: '16789487',
    phone: '305-212-0647',
    lastAppointment: '04/10/2020 10:30 AM',
    doctor: 'Dr. James Stevens',
    reason: 'Joint disorders, including osteoarthritis',
    avatar: 'B',
  },
  {
    id: 'daniel-w-madis',
    name: 'Daniel W. Madis',
    gender: 'M',
    patientId: '12487914',
    phone: '317-880-3788',
    lastAppointment: '04/09/2020 11:30 AM',
    doctor: 'Dr. Carlos Murphy',
    reason: 'High blood pressures',
    avatar: 'D',
  },
  {
    id: 'jennifer-j-yates',
    name: 'Jennifer J. Yates',
    gender: 'F',
    patientId: '13694875',
    phone: '701-855-4967',
    lastAppointment: '03/31/2020 09:30 AM',
    doctor: 'Dr. James Stevens',
    reason: 'Headaches and migraines',
    avatar: 'J',
  },
  {
    id: 'keri-r-malone',
    name: 'Keri R. Malone',
    gender: 'F',
    patientId: '15479153',
    phone: '602-295-6550',
    lastAppointment: '03/31/2020 11:30 AM',
    doctor: 'Dr. Carlos Murphy',
    reason: 'Chest pain',
    avatar: 'K',
  },
  {
    id: 'kevin-m-clark',
    name: 'Kevin M. Clark',
    gender: 'M',
    patientId: '16847936',
    phone: '936-525-7215',
    lastAppointment: '03/28/2020 12:30 PM',
    doctor: 'Dr. Wilbur Moller',
    reason: 'General health checkup',
    avatar: 'K',
  },
  {
    id: 'michael-f-owen',
    name: 'Michael F. Owen',
    gender: 'M',
    patientId: '15321904',
    phone: '641-992-8726',
    lastAppointment: '03/28/2020 10:30 AM',
    doctor: 'Dr. James Stevens',
    reason: 'Diabetes',
    avatar: 'M',
  },
  {
    id: 'patrick-m-cooper',
    name: 'Patrick M. Cooper',
    gender: 'M',
    patientId: '15321908',
    phone: '386-428-4030',
    lastAppointment: '03/28/2020 11:30 AM',
    doctor: 'Dr. Carlos Murphy',
    reason: 'Anxiety, bipolar disorder, and depression',
    avatar: 'P',
  },
  {
    id: 'sarah-f-beus',
    name: 'Sarah F. Beus',
    gender: 'F',
    patientId: '11548793',
    phone: '856-988-7815',
    lastAppointment: '03/27/2020 11:30 AM',
    doctor: 'Dr. Wilbur Moller',
    reason: 'Headaches and migraines',
    avatar: 'S',
  },
  {
    id: 'sharon-j-cook',
    name: 'Sharon J. Cook',
    gender: 'F',
    patientId: '16584498',
    phone: '774-263-0594',
    lastAppointment: '03/26/2020 10:00 AM',
    doctor: 'Dr. Carlos Murphy',
    reason: 'High blood pressures',
    avatar: 'S',
  },
];

export default function MainConsolePage() {
  const router = useRouter();

  const handleNavigate = (patient: Patient) => {
    router.push(`/midwife/patient-console/patients/${patient.id}`);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">Patients</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 md:w-[300px]">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search Patient"
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>

            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-zinc-800 px-4 text-sm font-medium text-white transition hover:bg-zinc-700">
              <Filter className="h-4 w-4" />
              Filter
            </button>

            <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#d04f51] px-4 text-sm font-semibold text-white transition hover:bg-red-400">
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full">
            <thead className="bg-zinc-900/80">
              <tr className="text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-5 py-4 font-medium">Patient Name</th>
                <th className="px-5 py-4 font-medium">Patient ID</th>
                <th className="px-5 py-4 font-medium">Phone Number</th>
                <th className="px-5 py-4 font-medium">Last Appointment Date</th>
                <th className="px-5 py-4 font-medium">Doctor</th>
                <th className="px-5 py-4 font-medium">Reason</th>
                <th className="px-5 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => handleNavigate(patient)}
                  className="group cursor-pointer transition hover:bg-zinc-900/60"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white ring-1 ring-white/10">
                        {patient.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-red-400">
                          {patient.name}, {patient.gender}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {patient.patientId}
                  </td>
                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {patient.phone}
                  </td>
                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {patient.lastAppointment}
                  </td>
                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {patient.doctor}
                  </td>
                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {patient.reason}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm text-zinc-400">
          <span>Displaying Page 1 of 25</span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5">
              ←
            </button>
            <button className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}