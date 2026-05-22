import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/authentication";
import healthRecordsApi from "@/app/api/health-records/api";

type RouteContext = {
  params: Promise<{
    categoryId: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { categoryId } = await context.params;

    const session = await getSession();
    const token = session?.user?.token;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const records = await healthRecordsApi.getRecordsByCategory(
      token,
      categoryId
    );

    return NextResponse.json({
      records,
      categoryName: records?.[0]?.categoryName ?? "",
    });
  } catch (error) {
    console.error("Failed to fetch health records:", error);

    return NextResponse.json(
      { message: "Failed to load health records." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { categoryId } = await context.params;

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

    const created = await healthRecordsApi.createRecord(token, categoryId, {
      name,
      date,
      description: description || undefined,
      files,
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("Failed to create health record:", error);

    return NextResponse.json(
      { message: "Failed to save record. Please try again." },
      { status: 500 }
    );
  }
}