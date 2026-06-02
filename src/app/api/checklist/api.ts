const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ChecklistItemDto {
  id: number;
  name: string;
  quantity: number;
  category: "Mother" | "Baby" | string;
  checked: boolean;
}

type ChecklistItemApiDto = Omit<ChecklistItemDto, "checked"> & {
  checked?: boolean;
};

type ChecklistItemCreateDto = Omit<ChecklistItemDto, "id" | "checked">;

type ChecklistItemUpdateDto = Partial<ChecklistItemCreateDto>;

const withUncheckedState = (
  item: ChecklistItemApiDto
): ChecklistItemDto => ({
  ...item,
  checked: false,
});

export const getMasterChecklist = async (
  midwifeId: number
): Promise<ChecklistItemDto[]> => {
  const res = await fetch(
    `${BASE_URL}/api/checklist/master/midwife/${midwifeId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch master checklist");

  const data = (await res.json()) as ChecklistItemApiDto[];

  return data.map(withUncheckedState);
};

export const addChecklistItem = async (
  midwifeId: number,
  item: ChecklistItemCreateDto
): Promise<ChecklistItemDto> => {
  const res = await fetch(
    `${BASE_URL}/api/checklist/master/midwife/${midwifeId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }
  );

  if (!res.ok) throw new Error("Failed to add checklist item");

  const data = (await res.json()) as ChecklistItemApiDto;

  return withUncheckedState(data);
};

export const updateChecklistItem = async (
  midwifeId: number,
  id: number,
  item: ChecklistItemUpdateDto
): Promise<ChecklistItemDto> => {
  const res = await fetch(
    `${BASE_URL}/api/checklist/master/midwife/${midwifeId}/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }
  );

  if (!res.ok) throw new Error("Failed to update checklist item");

  const data = (await res.json()) as ChecklistItemApiDto;

  return withUncheckedState(data);
};

export const deleteChecklistItem = async (
  midwifeId: number,
  id: number
): Promise<void> => {
  const res = await fetch(
    `${BASE_URL}/api/checklist/master/midwife/${midwifeId}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) throw new Error("Failed to delete checklist item");
};

export const getUserChecklist = async (
  userId: number,
  midwifeId: number
): Promise<ChecklistItemDto[]> => {
  const res = await fetch(
    `${BASE_URL}/api/checklist/user/${userId}/midwife/${midwifeId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch user checklist");

  return (await res.json()) as ChecklistItemDto[];
};

export const toggleUserChecklistItem = async (
  userId: number,
  midwifeId: number,
  checklistId: number
): Promise<ChecklistItemDto> => {
  const res = await fetch(
    `${BASE_URL}/api/checklist/user/${userId}/midwife/${midwifeId}/toggle/${checklistId}`,
    {
      method: "PATCH",
    }
  );

  if (!res.ok) throw new Error("Failed to toggle checklist item");

  return (await res.json()) as ChecklistItemDto;
};