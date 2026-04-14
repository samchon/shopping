import { toErrorResponse } from "@/server/shopping/errors";
import { getOrderDetail } from "@/server/shopping/orders";
import { jsonWithCustomerSession } from "@/server/shopping/session";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    return await jsonWithCustomerSession(request, (context) =>
      getOrderDetail(id, context),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
