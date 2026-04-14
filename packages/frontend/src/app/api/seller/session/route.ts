import { toErrorResponse } from "@/server/shopping/errors";
import { getSellerSessionData } from "@/server/shopping/seller";
import { jsonWithCustomerSession } from "@/server/shopping/session";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await jsonWithCustomerSession(request, getSellerSessionData);
  } catch (error) {
    return toErrorResponse(error);
  }
}
