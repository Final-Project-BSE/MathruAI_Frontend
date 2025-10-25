import { NextRequest, NextResponse } from 'next/server';
import { signIn } from "@/actions/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Testing login with:", { email });

    const response = await signIn({ email, password });

    console.log("Raw backend response:", JSON.stringify(response, null, 2));

    const analysis = {
      hasStatus: !!response.status,
      status: response.status,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      roles: response.data?.roles,
      rolesType: typeof response.data?.roles,
      rolesIsArray: Array.isArray(response.data?.roles),
      rolesLength: response.data?.roles ? 
        (Array.isArray(response.data.roles) ? response.data.roles.length : 'not an array') 
        : 'no roles',
    };

    console.log("Response analysis:", analysis);

    return NextResponse.json({
      success: true,
      rawResponse: response,
      analysis,
    });
  } catch (error) {
    console.error("Test login error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}