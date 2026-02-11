export type FinancialTransactionType =
  | 'CLIENT_DEPOSIT'
  | 'DELIVERY_PAYMENT'
  | 'CANCELLATION_PENALTY';

export interface FinancialTransaction {
  id: string;
  occurredAt: string;
  type: FinancialTransactionType;
  originUserId: string | null;
  destinationUserId: string | null;
  deliveryId: string | null;
  amount: number;
  description: string;
}

export interface FinancialSummary {
  totalClientDeposits: number;
  totalDriverPayments: number;
  totalCancellationPenalties: number;
  totalWalletBalance: number | null;
}
