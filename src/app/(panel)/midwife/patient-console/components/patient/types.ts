export type PatientPageProps = {
  params: {
    id: string;
  };
};

export type Visit = {
  doctor: string;
  specialty: string;
  time: string;
  duration: string;
  patient: string;
  date: string;
  weekday: string;
};

export type DocumentItem = {
  title: string;
  subtitle: string;
};

export type Measurement = {
  label: string;
  value: string;
  accent: 'green' | 'red' | 'purple' | 'dark';
};

export type Patient = {
  id: string;
  name: string;
  gender: 'M' | 'F';
  patientId: string;
  phone: string;
  lastAppointment: string;
  doctor: string;
  reason: string;
  avatar: string;

  birthDate: string;
  registrationDate: string;
  email: string;
  address: string;
  age: number;

  measurements: Measurement[];
  documents: DocumentItem[];
  visitsAnalysis: number;
  visitsCount: number;
  recentVisits: Visit[];
};