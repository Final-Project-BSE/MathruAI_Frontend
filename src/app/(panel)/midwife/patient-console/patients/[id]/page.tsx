type PatientPageProps = {
  params: {
    id: string;
  };
};

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

export default function PatientDetailsPage({ params }: PatientPageProps) {
  const patient = patients.find((item) => item.id === params.id);

  if (!patient) {
    return (
      <div className="min-h-screen bg-black px-4 py-6 text-white md:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
          <h1 className="text-2xl font-semibold text-red-400">Patient not found</h1>
          <p className="mt-3 text-zinc-400">
            No patient exists for id: <span className="text-white">{params.id}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-xl font-bold text-white ring-1 ring-white/10">
                {patient.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">
                  {patient.name}, {patient.gender}
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Patient record details
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
              <p className="text-zinc-400">Patient ID</p>
              <p className="font-medium text-white">{patient.patientId}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-400">Phone Number</p>
                <p className="text-white">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Gender</p>
                <p className="text-white">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Profile URL ID</p>
                <p className="text-white">{patient.id}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Appointment Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-400">Last Appointment</p>
                <p className="text-white">{patient.lastAppointment}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Doctor</p>
                <p className="text-white">{patient.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Reason</p>
                <p className="text-white">{patient.reason}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold">Notes</h2>
          <p className="text-zinc-400">
            This is a sample patient details page. Right now it reads from the same
            hardcoded patient array as your table. That is fine for UI testing, but it
            is not a real data model. When you move beyond mock data, both pages should
            read from one shared source instead of duplicating the array.
          </p>
        </div>
      </div>
    </div>
  );
}