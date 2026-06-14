import { TransactionStatus } from "@/graphql/generated/output";

const statusStyles: Record<TransactionStatus, string> = {
  [TransactionStatus.Success]:
    "border-green-500/20 bg-green-500/10 text-green-500",
  [TransactionStatus.Pending]:
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
  [TransactionStatus.Failed]: "border-red-500/20 bg-red-500/10 text-red-500",
  [TransactionStatus.Expired]: "border-gray-500/20 bg-gray-500/10 text-gray-500",
};

export function getTransactionStatusStyle(status: TransactionStatus) {
  return statusStyles[status];
}

export function getTransactionStatusLabelKey(
  status: TransactionStatus,
): "success" | "pending" | "failed" | "expired" {
  switch (status) {
    case TransactionStatus.Success:
      return "success";
    case TransactionStatus.Pending:
      return "pending";
    case TransactionStatus.Failed:
      return "failed";
    case TransactionStatus.Expired:
      return "expired";
  }
}
