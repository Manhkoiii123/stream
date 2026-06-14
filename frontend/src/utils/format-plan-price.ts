const USD_TO_VND_RATE = 25_000;

export function formatPlanPrice(priceUsd: number, locale: string): string {
  if (locale === "vi") {
    const vnd = Math.round(priceUsd * USD_TO_VND_RATE);

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(vnd);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceUsd);
}
