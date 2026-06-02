import axios, { AxiosError } from "axios";
import type {
  ApiEnvelope,
  AppointmentCreateRequestDto,
  AppointmentListResponseDto,
  AppointmentRequestResponseDto,
  AppointmentResponseDto,
  BookedSlotsResponseDto,
  UpcomingAppointmentResponseDto,
  UnavailableDatesResponseDto,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8081";

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function getErrorMessage(err: unknown, fallback: string) {
  const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
  const status = axiosErr.response?.status;
  const backendMessage = axiosErr.response?.data?.error || axiosErr.response?.data?.message;

  if (backendMessage) return backendMessage;

  if (status === 400) return "Invalid appointment request.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "Appointment not found.";

  return fallback;
}

function normalizeAppointmentRow(raw: unknown): AppointmentResponseDto {
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    id: String(input.id ?? input.appointmentId ?? ""),
    patientId: Number(input.patientId ?? input.userId ?? 0),
    midwifeId: input.midwifeId !== undefined ? Number(input.midwifeId) : undefined,
    appointmentDate: String(input.appointmentDate ?? ""),
    startTime: String(input.startTime ?? ""),
    endTime:
      input.endTime !== undefined && input.endTime !== null ? String(input.endTime) : null,
    appointmentType: String(input.appointmentType ?? "CLINIC_VISIT") as AppointmentResponseDto["appointmentType"],
    location: String(input.location ?? ""),
    notes: input.notes !== undefined ? String(input.notes) : undefined,
    status: String(input.status ?? "SCHEDULED") as AppointmentResponseDto["status"],
    createdAt: input.createdAt !== undefined ? String(input.createdAt) : undefined,
    updatedAt: input.updatedAt !== undefined ? String(input.updatedAt) : undefined,
  };
}

function normalizeAppointmentsPayload(
  payload:
    | ApiEnvelope<AppointmentResponseDto[] | AppointmentListResponseDto>
    | AppointmentResponseDto[]
): AppointmentResponseDto[] {
  if (Array.isArray(payload)) {
    return payload.map(normalizeAppointmentRow);
  }

  if (payload?.data) {
    if (Array.isArray(payload.data)) {
      return payload.data.map(normalizeAppointmentRow);
    }

    if (
      typeof payload.data === "object" &&
      payload.data &&
      Array.isArray((payload.data as AppointmentListResponseDto).appointments)
    ) {
      return (payload.data as AppointmentListResponseDto).appointments.map(normalizeAppointmentRow);
    }
  }

  return [];
}

function normalizeUpcomingPayload(
  payload:
    | ApiEnvelope<UpcomingAppointmentResponseDto[]>
    | UpcomingAppointmentResponseDto[]
): UpcomingAppointmentResponseDto[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function normalizeUnavailableDatesPayload(
  payload: ApiEnvelope<UnavailableDatesResponseDto> | UnavailableDatesResponseDto
): UnavailableDatesResponseDto {
  if ("data" in (payload as ApiEnvelope<UnavailableDatesResponseDto>)) {
    return ((payload as ApiEnvelope<UnavailableDatesResponseDto>).data || {
      dates: [],
    }) as UnavailableDatesResponseDto;
  }

  return payload as UnavailableDatesResponseDto;
}

function normalizeBookedSlotsPayload(
  payload: ApiEnvelope<BookedSlotsResponseDto> | BookedSlotsResponseDto,
  date: string
): BookedSlotsResponseDto {
  const source = "data" in (payload as ApiEnvelope<BookedSlotsResponseDto>)
    ? (payload as ApiEnvelope<BookedSlotsResponseDto>).data
    : (payload as BookedSlotsResponseDto);

  return {
    date: source?.date || date,
    bookedSlots: Array.isArray(source?.bookedSlots) ? source.bookedSlots : [],
  };
}

function normalizeRequestRow(raw: unknown): AppointmentRequestResponseDto {
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    requestId: String(input.requestId ?? input.id ?? ""),
    midwifeId: Number(input.midwifeId ?? 0),
    userId: Number(input.userId ?? input.patientId ?? 0),
    firstName: input.firstName !== undefined ? String(input.firstName) : undefined,
    lastName: input.lastName !== undefined ? String(input.lastName) : undefined,
    userEmail: input.userEmail !== undefined ? String(input.userEmail) : undefined,
    appointmentDate: String(input.appointmentDate ?? ""),
    startTime: String(input.startTime ?? ""),
    endTime:
      input.endTime !== undefined && input.endTime !== null ? String(input.endTime) : null,
    appointmentType: String(input.appointmentType ?? "CLINIC_VISIT") as AppointmentRequestResponseDto["appointmentType"],
    location: String(input.location ?? ""),
    notes: input.notes !== undefined ? String(input.notes) : undefined,
    status: String(input.status ?? "PENDING") as AppointmentRequestResponseDto["status"],
    requestedAt: input.requestedAt !== undefined ? String(input.requestedAt) : undefined,
    updatedAt: input.updatedAt !== undefined ? String(input.updatedAt) : undefined,
  };
}

function normalizeRequestListPayload(
  payload:
    | ApiEnvelope<AppointmentRequestResponseDto[]>
    | AppointmentRequestResponseDto[]
): AppointmentRequestResponseDto[] {
  if (Array.isArray(payload)) {
    return payload.map(normalizeRequestRow);
  }

  if (Array.isArray(payload?.data)) {
    return payload.data.map(normalizeRequestRow);
  }

  return [];
}

export const appointmentApi = {
  async getPatientAppointments(
    token: string,
    midwifeId: number,
    userId: number
  ): Promise<AppointmentResponseDto[]> {
    try {
      const res = await http.get<
        ApiEnvelope<AppointmentResponseDto[] | AppointmentListResponseDto> | AppointmentResponseDto[]
      >(`/api/appointments/midwife/${midwifeId}/user/${userId}`, {
        headers: authHeader(token),
      });

      return normalizeAppointmentsPayload(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 404) return [];
      throw new Error(getErrorMessage(err, "Failed to fetch appointments"));
    }
  },

  async getUnavailableDates(
    token: string,
    midwifeId: number,
    userId: number
  ): Promise<UnavailableDatesResponseDto> {
    try {
      const res = await http.get<
        ApiEnvelope<UnavailableDatesResponseDto> | UnavailableDatesResponseDto
      >(`/api/appointments/midwife/${midwifeId}/user/${userId}/unavailable-dates`, {
        headers: authHeader(token),
      });

      const normalized = normalizeUnavailableDatesPayload(res.data);
      return {
        dates: Array.isArray(normalized.dates) ? normalized.dates : [],
        reasonByDate: normalized.reasonByDate || {},
      };
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 404) {
        return { dates: [], reasonByDate: {} };
      }

      throw new Error(getErrorMessage(err, "Failed to fetch unavailable dates"));
    }
  },

  async getBookedSlots(
    token: string,
    midwifeId: number,
    userId: number,
    date: string
  ): Promise<BookedSlotsResponseDto> {
    try {
      const res = await http.get<
        ApiEnvelope<BookedSlotsResponseDto> | BookedSlotsResponseDto
      >(`/api/appointments/midwife/${midwifeId}/user/${userId}/booked-slots`, {
        headers: authHeader(token),
        params: { date },
      });

      return normalizeBookedSlotsPayload(res.data, date);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 404) {
        return { date, bookedSlots: [] };
      }

      throw new Error(getErrorMessage(err, "Failed to fetch booked time slots"));
    }
  },

  async createAppointment(
    token: string,
    midwifeId: number,
    userId: number,
    payload: AppointmentCreateRequestDto
  ): Promise<AppointmentResponseDto> {
    try {
      const requestBody = {
        appointmentDate: payload.appointmentDate,
        startTime: payload.startTime,
        endTime: payload.endTime ?? null,
        appointmentType: payload.appointmentType,
        location: payload.location,
        notes: payload.notes,
      };

      const res = await http.post<
        ApiEnvelope<AppointmentResponseDto> | AppointmentResponseDto
      >(`/api/appointments/midwife/${midwifeId}/user/${userId}`, requestBody, {
        headers: authHeader(token),
      });

      const row = "data" in (res.data as ApiEnvelope<AppointmentResponseDto>)
        ? (res.data as ApiEnvelope<AppointmentResponseDto>).data
        : (res.data as AppointmentResponseDto);

      if (!row) {
        throw new Error("Appointment response is empty");
      }

      return normalizeAppointmentRow(row);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 409) {
        throw new Error("Selected time slot is already booked.");
      }
      throw new Error(getErrorMessage(err, "Failed to create appointment"));
    }
  },

  async cancelAppointment(
    token: string,
    midwifeId: number,
    userId: number,
    appointmentId: string
  ): Promise<AppointmentResponseDto> {
    try {
      const res = await http.patch<
        ApiEnvelope<AppointmentResponseDto> | AppointmentResponseDto
      >(
        `/api/appointments/midwife/${midwifeId}/user/${userId}/${appointmentId}/cancel`,
        {},
        { headers: authHeader(token) }
      );

      const row = "data" in (res.data as ApiEnvelope<AppointmentResponseDto>)
        ? (res.data as ApiEnvelope<AppointmentResponseDto>).data
        : (res.data as AppointmentResponseDto);

      if (!row) {
        throw new Error("Appointment response is empty");
      }

      return normalizeAppointmentRow(row);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to cancel appointment"));
    }
  },

  async completeAppointment(
    token: string,
    midwifeId: number,
    userId: number,
    appointmentId: string
  ): Promise<AppointmentResponseDto> {
    try {
      const res = await http.patch<
        ApiEnvelope<AppointmentResponseDto> | AppointmentResponseDto
      >(
        `/api/appointments/midwife/${midwifeId}/user/${userId}/${appointmentId}/complete`,
        {},
        { headers: authHeader(token) }
      );

      const row = "data" in (res.data as ApiEnvelope<AppointmentResponseDto>)
        ? (res.data as ApiEnvelope<AppointmentResponseDto>).data
        : (res.data as AppointmentResponseDto);

      if (!row) {
        throw new Error("Appointment response is empty");
      }

      return normalizeAppointmentRow(row);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to complete appointment"));
    }
  },

  async deleteAppointment(
    token: string,
    midwifeId: number,
    userId: number,
    appointmentId: string
  ): Promise<void> {
    try {
      await http.delete(
        `/api/appointments/midwife/${midwifeId}/user/${userId}/${appointmentId}`,
        {
          headers: authHeader(token),
        }
      );
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to delete appointment"));
    }
  },

  async getUpcomingAppointments(
    token: string,
    midwifeId: number
  ): Promise<UpcomingAppointmentResponseDto[]> {
    try {
      const res = await http.get<
        ApiEnvelope<UpcomingAppointmentResponseDto[]> | UpcomingAppointmentResponseDto[]
      >(`/api/appointments/midwife/${midwifeId}/upcoming`, {
        headers: authHeader(token),
      });

      return normalizeUpcomingPayload(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 404) return [];
      throw new Error(getErrorMessage(err, "Failed to fetch upcoming appointments"));
    }
  },

  async createAppointmentRequest(
    token: string,
    midwifeId: number,
    userId: number,
    payload: AppointmentCreateRequestDto
  ): Promise<AppointmentRequestResponseDto> {
    try {
      const requestBody = {
        appointmentDate: payload.appointmentDate,
        startTime: payload.startTime,
        endTime: payload.endTime ?? null,
        appointmentType: payload.appointmentType,
        location: payload.location,
        notes: payload.notes,
      };

      const res = await http.post<
        ApiEnvelope<AppointmentRequestResponseDto> | AppointmentRequestResponseDto
      >(`/api/appointment-requests/midwife/${midwifeId}/user/${userId}`, requestBody, {
        headers: authHeader(token),
      });

      const row = "data" in (res.data as ApiEnvelope<AppointmentRequestResponseDto>)
        ? (res.data as ApiEnvelope<AppointmentRequestResponseDto>).data
        : (res.data as AppointmentRequestResponseDto);

      if (!row) {
        throw new Error("Appointment request response is empty");
      }

      return normalizeRequestRow(row);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 409) {
        throw new Error("Selected time slot is already booked.");
      }

      throw new Error(getErrorMessage(err, "Failed to create appointment request"));
    }
  },

  async getMidwifeAppointmentRequests(
    token: string,
    midwifeId: number
  ): Promise<AppointmentRequestResponseDto[]> {
    try {
      const res = await http.get<
        ApiEnvelope<AppointmentRequestResponseDto[]> | AppointmentRequestResponseDto[]
      >(`/api/appointment-requests/midwife/${midwifeId}`, {
        headers: authHeader(token),
      });

      return normalizeRequestListPayload(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 404) return [];
      throw new Error(getErrorMessage(err, "Failed to fetch requested appointments"));
    }
  },

  async acceptAppointmentRequest(
    token: string,
    midwifeId: number,
    requestId: string
  ): Promise<AppointmentRequestResponseDto> {
    try {
      const res = await http.patch<
        ApiEnvelope<AppointmentRequestResponseDto> | AppointmentRequestResponseDto
      >(`/api/appointment-requests/midwife/${midwifeId}/${requestId}/accept`, {}, {
        headers: authHeader(token),
      });

      const row = "data" in (res.data as ApiEnvelope<AppointmentRequestResponseDto>)
        ? (res.data as ApiEnvelope<AppointmentRequestResponseDto>).data
        : (res.data as AppointmentRequestResponseDto);

      if (!row) {
        throw new Error("Appointment request response is empty");
      }

      return normalizeRequestRow(row);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 409) {
        throw new Error("Selected time slot is already booked.");
      }
      throw new Error(getErrorMessage(err, "Failed to accept appointment request"));
    }
  },

  async declineAppointmentRequest(
    token: string,
    midwifeId: number,
    requestId: string
  ): Promise<AppointmentRequestResponseDto> {
    try {
      const res = await http.patch<
        ApiEnvelope<AppointmentRequestResponseDto> | AppointmentRequestResponseDto
      >(`/api/appointment-requests/midwife/${midwifeId}/${requestId}/decline`, {}, {
        headers: authHeader(token),
      });

      const row = "data" in (res.data as ApiEnvelope<AppointmentRequestResponseDto>)
        ? (res.data as ApiEnvelope<AppointmentRequestResponseDto>).data
        : (res.data as AppointmentRequestResponseDto);

      if (!row) {
        throw new Error("Appointment request response is empty");
      }

      return normalizeRequestRow(row);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to decline appointment request"));
    }
  },
};
