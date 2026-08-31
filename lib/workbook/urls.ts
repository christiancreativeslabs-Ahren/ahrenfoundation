export function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function buildWorkbookModuleUrl(deliveryId: string, accessToken: string) {
  return `${getAppBaseUrl()}/workbook/${deliveryId}?token=${encodeURIComponent(accessToken)}`;
}

export function buildTrackedWorkbookClickUrl(
  deliveryId: string,
  accessToken: string
) {
  return `${getAppBaseUrl()}/api/email/click/${deliveryId}/${accessToken}`;
}

export function buildEmailOpenUrl(deliveryId: string, accessToken: string) {
  return `${getAppBaseUrl()}/api/email/open/${deliveryId}/${accessToken}`;
}
