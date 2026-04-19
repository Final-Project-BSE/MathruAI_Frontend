import type {
  HealthMonitoringResponseDto,
  HealthMonitoringUpsertRequestDto,
} from "../../../../../../../api/healthmonitor/types";

export type FormState = {
  age: string;
  systolicBP: string;
  diastolicBP: string;
  bs: string;
  bodyTemp: string;
  bmi: string;
  heartRate: string;
  previousComplications: string;
  preexistingDiabetes: string;
  gestationalDiabetes: string;
  mentalHealth: string;
};

export function buildFormState(
  monitoring: HealthMonitoringResponseDto | null
): FormState {
  return {
    age: monitoring?.age?.toString() ?? "",
    systolicBP: monitoring?.systolicBP?.toString() ?? "",
    diastolicBP: monitoring?.diastolicBP?.toString() ?? "",
    bs: monitoring?.bs?.toString() ?? "",
    bodyTemp: monitoring?.bodyTemp?.toString() ?? "",
    bmi: monitoring?.bmi?.toString() ?? "",
    heartRate: monitoring?.heartRate?.toString() ?? "",
    previousComplications: String(monitoring?.previousComplications ?? 0),
    preexistingDiabetes: String(monitoring?.preexistingDiabetes ?? 0),
    gestationalDiabetes: String(monitoring?.gestationalDiabetes ?? 0),
    mentalHealth: String(monitoring?.mentalHealth ?? 0),
  };
}

export function toNumber(value: string) {
  return Number(value);
}

export function validateAndBuildPayload(
  form: FormState
): { payload?: HealthMonitoringUpsertRequestDto; error?: string } {
  const requiredEntries: Array<[string, string]> = [
    ["Age", form.age],
    ["Systolic BP", form.systolicBP],
    ["Diastolic BP", form.diastolicBP],
    ["Blood Sugar", form.bs],
    ["Body Temperature", form.bodyTemp],
    ["BMI", form.bmi],
    ["Heart Rate", form.heartRate],
  ];

  const missing = requiredEntries.find(([, value]) => value.trim() === "");
  if (missing) {
    return { error: `${missing[0]} is required.` };
  }

  const payload: HealthMonitoringUpsertRequestDto = {
    age: toNumber(form.age),
    systolicBP: toNumber(form.systolicBP),
    diastolicBP: toNumber(form.diastolicBP),
    bs: toNumber(form.bs),
    bodyTemp: toNumber(form.bodyTemp),
    bmi: toNumber(form.bmi),
    heartRate: toNumber(form.heartRate),
    previousComplications: toNumber(form.previousComplications),
    preexistingDiabetes: toNumber(form.preexistingDiabetes),
    gestationalDiabetes: toNumber(form.gestationalDiabetes),
    mentalHealth: toNumber(form.mentalHealth),
  };

  const invalid = Object.entries(payload).find(([, value]) =>
    Number.isNaN(value)
  );

  if (invalid) {
    return { error: `Invalid value for ${invalid[0]}.` };
  }

  return { payload };
}