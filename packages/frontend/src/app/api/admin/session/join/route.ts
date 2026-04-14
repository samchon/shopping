import { joinAdmin } from "@/server/shopping/admin";
import { toErrorResponse } from "@/server/shopping/errors";
import { jsonWithCustomerSession } from "@/server/shopping/session";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    return await jsonWithCustomerSession(request, joinAdmin);
  } catch (error) {
    return toErrorResponse(error);
  }
}
