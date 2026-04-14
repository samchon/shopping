import { toErrorResponse } from "@/server/shopping/errors";
import { getSellerDashboard } from "@/server/shopping/seller";
import { jsonWithCustomerSession } from "@/server/shopping/session";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await jsonWithCustomerSession(request, getSellerDashboard);
  } catch (error) {
    return toErrorResponse(error);
  }
}
