import { toErrorResponse } from "@/server/shopping/errors";
import { loginSeller } from "@/server/shopping/seller";
import { jsonWithCustomerSession } from "@/server/shopping/session";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    return await jsonWithCustomerSession(request, (context) =>
      loginSeller(payload, context),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
