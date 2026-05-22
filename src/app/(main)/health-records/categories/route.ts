import { NextResponse } from "next/server";

import { getSession } from "@/lib/authentication";
import { getCategories } from "@/app/api/health-records/api";

export async function GET() {
  try {
    const session = await getSession();
    const token = session?.user?.token;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const categories = await getCategories(token);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch health record categories:", error);

    return NextResponse.json(
      { message: "Failed to load health record categories." },
      { status: 500 }
    );
  }
}