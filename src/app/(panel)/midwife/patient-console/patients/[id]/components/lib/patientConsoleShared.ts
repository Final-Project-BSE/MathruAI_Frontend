import type { UserResponseDto } from "@/app/api/user-assign/types";

export function getPatientAvatarText(patient: UserResponseDto) {
  const first = patient.firstName?.[0] ?? "";
  const last = patient.lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

export function getPatientEmailLabel(patient: UserResponseDto) {
  if (patient.email) return patient.email;
  return "No area";
}

export function getPatientAreaLabel(patient: UserResponseDto) {
  if (patient.area) return patient.area;
  if (patient.mohArea && patient.district) return `${patient.mohArea}, ${patient.district}`;
  if (patient.mohArea) return patient.mohArea;
  if (patient.district) return patient.district;
  return "No area";
}

export function filterPatients(patients: UserResponseDto[], search: string) {
  const q = search.trim().toLowerCase();
  if (!q) return patients;

  return patients.filter((patient) => {
    const fullName = `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.toLowerCase();
    const email = (patient.email ?? "").toLowerCase();
    const phone = (patient.phoneNumber ?? "").toLowerCase();
    const district = (patient.district ?? "").toLowerCase();
    const mohArea = (patient.mohArea ?? "").toLowerCase();
    const area = (patient.area ?? "").toLowerCase();

    return (
      fullName.includes(q) ||
      email.includes(q) ||
      phone.includes(q) ||
      district.includes(q) ||
      mohArea.includes(q) ||
      area.includes(q)
    );
  });
}