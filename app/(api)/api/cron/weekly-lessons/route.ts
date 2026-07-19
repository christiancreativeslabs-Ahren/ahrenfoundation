import { GET as handleModuleDeliveriesCron } from "@/app/(api)/api/cron/module-deliveries/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleModuleDeliveriesCron(request);
}
