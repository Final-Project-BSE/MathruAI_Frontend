import type { Patient } from './types';
import { DotMenuIcon, LocationIcon, MailIcon, PhoneIcon } from './icons';

type PatientInfoCardProps = {
  patient: Patient & {
    profileImage?: string;
  };
};

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <div className="rounded-2xl border border-[#26262b] bg-[#0f0f10] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_130px]">
        <div>
          <div className="mb-4 flex items-center gap-4">
            {patient.profileImage ? (
              <img
                src={patient.profileImage}
                alt={patient.name}
                className="h-16 w-16 rounded-full border border-[#34343a] object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#34343a] bg-[#161618] text-lg font-semibold text-[#fab0a7]">
                {patient.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-base font-semibold text-[#f5f5f5]">
                <span>{patient.name}</span>
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-[#34343a] text-[10px] text-[#fab0a7]">
                  ↗
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-y-2 text-xs">
            <div className="text-[#8c8c95]">Birth date</div>
            <div className="text-[#d6d6db]">{patient.birthDate}</div>

            <div className="text-[#8c8c95]">Phone</div>
            <div className="flex items-center gap-2 text-[#d6d6db]">
              <PhoneIcon />
              <span>{patient.phone}</span>
            </div>

            <div className="text-[#8c8c95]">Gender</div>
            <div className="text-[#d6d6db]">
              {patient.gender === 'M' ? 'Male' : 'Female'}
            </div>

            <div className="text-[#8c8c95]">Email</div>
            <div className="flex items-center gap-2 break-all text-[#d6d6db]">
              <MailIcon />
              <span>{patient.email}</span>
            </div>

            <div className="text-[#8c8c95]">Age</div>
            <div className="text-[#d6d6db]">{patient.age}</div>

            <div className="text-[#8c8c95]">Address</div>
            <div className="flex items-start gap-2 text-[#d6d6db]">
              <LocationIcon />
              <span>{patient.address}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-[#8c8c95]">Registration date</div>
            <div className="mt-1 text-xs font-semibold text-[#fab0a7]">
              {patient.registrationDate}
            </div>
          </div>
          <button className="text-[#7a7a84] transition hover:text-[#fab0a7]">
            <DotMenuIcon />
          </button>
        </div>
      </div>
    </div>
  );
}