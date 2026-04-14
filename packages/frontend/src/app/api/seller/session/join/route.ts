import { toErrorResponse } from "@/server/shopping/errors";
import { joinSeller } from "@/server/shopping/seller";
import { jsonWithCustomerSession } from "@/server/shopping/session";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    return await jsonWithCustomerSession(request, joinSeller);
  } catch (error) {
    return toErrorResponse(error);
  }
}
