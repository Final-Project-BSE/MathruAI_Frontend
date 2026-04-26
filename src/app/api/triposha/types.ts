export interface TriposhaRecord {
  id: number;
  patientId: number;
  midwifeId: number;
  distributionDate: string;
  quantity: number;
  status: "GIVEN" | "PENDING" | "MISSED";
  nextDueDate: string;
  notes?: string;
}