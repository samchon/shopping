import { joinMember } from "@/server/shopping/account";
import { toErrorResponse } from "@/server/shopping/errors";
import { jsonWithCustomerSession } from "@/server/shopping/session";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    return await jsonWithCustomerSession(request, (context) =>
      joinMember(payload, context),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
