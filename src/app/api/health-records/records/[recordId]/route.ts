import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/authentication";
import healthRecordsApi, { updateRecord } from "@/app/api/health-records/api";

type RouteContext = {
  params: Promise<{
    recordId: string;
  }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { recordId } = await context.params;

    const session = await getSession();
    const token = session?.user?.token;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const name = String(formData.get("name") ?? "");
    const date = String(formData.get("date") ?? "");
    const description = String(formData.get("description") ?? "");
    const files = formData
      .getAll("files")
      .filter((file): file is File => file instanceof File);

    if (!name.trim() || !date.trim()) {
      return NextResponse.json(
        { message: "Record name and date are required." },
        { status: 400 }
      );
    }

    const updated = await updateRecord(token, recordId, {
      name,
      date,
      description: description || undefined,
      files,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update health record:", error);

    return NextResponse.json(
      { message: "Failed to update record." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { recordId } = await context.params;

    const session = await getSession();
    const token = session?.user?.token;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await healthRecordsApi.deleteRecord(token, recordId);

    return NextResponse.json({
      message: "Record deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete health record:", error);

    return NextResponse.json(
      { message: "Failed to delete record." },
      { status: 500 }
    );
  }
}