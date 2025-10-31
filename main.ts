type Transaction = {
  transactionId: string;
  userId: string;
  amount?: number;
  timestamp?: Date;
  location?: string;
};

type FlaggedTransaction = {
  transactionId: string;
  userId: string;
  riskScore: number;
  reasons: string[];
  errors?: string[];
};

type FraudDetectionReportSummary = {
  totalTransactions: number;
  flaggedCount: number;
  fraudRate: number;
};

type FraudDetectionReport = {
  flagged: FlaggedTransaction[];
  summary: FraudDetectionReportSummary;
  errors?: string[];
};

const HIGH_AMOUNT_RISK_SCORE = 70;
const RAPID_TRANSACTION_RISK_SCORE = 60;

const HIGH_AMOUNT_REASON = "highAmount";
const RAPID_TRANSACTION_REASON = "rapidTransactions";

const RAPID_TRANSACTION_MIN_TIME_DIFF_IN_MINUTES = 5;

const INVALID_DATA_ERROR_MESSAGE = "Invalid data detected in transactions";

const parseDate = (dateString: string): Date | undefined => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
};

const parseInt = (value: string): number | undefined => {
  const parsed = Number.parseInt(value);
  return isNaN(parsed) ? undefined : parsed;
};

const parseTransactions = (rawTransactions: string[]) => {
  // "txn_001,user_123,150,2024-01-15T10:30:00Z,New York",
  return rawTransactions.map((rawTransaction) => {
    const [transactionId, userId, amountStr, timestamp, location] =
      rawTransaction.split(",");

    const transaction: Transaction = {
      transactionId,
      userId,
      amount: parseInt(amountStr),
      timestamp: parseDate(timestamp),
      location,
    };

    return transaction;
  });
};

const highAmountRule = (
  transaction: Transaction
): FlaggedTransaction | null => {
  const { transactionId, userId } = transaction;

  if (transaction.amount === undefined) {
    throw new Error(INVALID_DATA_ERROR_MESSAGE);
  }

  return transaction.amount > 1000
    ? {
        transactionId,
        userId,
        riskScore: HIGH_AMOUNT_RISK_SCORE,
        reasons: [HIGH_AMOUNT_REASON],
      }
    : null;
};

const rapidTransactionsRule = (
  transaction: Transaction,
  allTransactions: Transaction[]
): FlaggedTransaction | null => {
  const { transactionId, userId, timestamp } = transaction;

  if (timestamp === undefined) {
    throw new Error(INVALID_DATA_ERROR_MESSAGE);
  }

  // find all transaction of same user id which are within 5 mins
  const foundTransactions = allTransactions.filter((transactionToCheck) => {
    // skip check if timestamp is undefined
    if (transactionToCheck.timestamp === undefined) return false;

    const timeDiffInMilliseconds = Math.abs(
      transactionToCheck.timestamp.getTime() - timestamp.getTime()
    );
    const timeDiffInMinutes = timeDiffInMilliseconds / 1000 / 60;

    const isMatched =
      transactionId !== transactionToCheck.transactionId &&
      transactionToCheck.userId === userId &&
      timeDiffInMinutes < RAPID_TRANSACTION_MIN_TIME_DIFF_IN_MINUTES;

    return isMatched;
  });

  return foundTransactions.length >= 2
    ? {
        transactionId,
        userId,
        riskScore: RAPID_TRANSACTION_RISK_SCORE,
        reasons: [RAPID_TRANSACTION_REASON],
      }
    : null;
};

export function detectFraud(rawTransactions: string[]): FraudDetectionReport {
  // step 1: parse transactions (in string array) into Transaction objects
  const transactions = parseTransactions(rawTransactions);

  // step 2: for each transaction, apply the rule engine, which contains 2 rules; each will
  // return 1: whether it is a hit, 2: riskScore
  const flagged = [];
  const errors = [];
  for (const transaction of transactions) {
    try {
      const ruleResults = [
        highAmountRule(transaction),
        rapidTransactionsRule(transaction, transactions),
      ].filter((MaybeFlaggedTransaction) => MaybeFlaggedTransaction !== null);

      const flaggedTransaction: FlaggedTransaction | null = ruleResults.length
        ? {
            transactionId: transaction.transactionId,
            userId: transaction.userId,
            riskScore: ruleResults.reduce(
              (prev, cur) => prev + cur.riskScore,
              0
            ),
            reasons: ruleResults.flatMap(({ reasons }) => reasons),
          }
        : null;

      if (flaggedTransaction) flagged.push(flaggedTransaction);
    } catch (error: unknown) {
      /*
       * Current error handling is to collect the first error only with try-catch.
       * To be discussed whether we want to have a more robust error handling mechanism.
       * For example, we could collect all errors and return them in the report.
       * Also we could include the transactionId which caused the error, with more helpful error message instead of a generic one.
       */
      errors.push((error as Error).message);
    }
  }

  // step 3: generate the final
  const totalTransactions = transactions.length;
  const flaggedCount = flagged.length;
  const fraudRate =
    totalTransactions === 0 ? 0 : flaggedCount / totalTransactions;

  const report: FraudDetectionReport = {
    flagged,
    summary: {
      totalTransactions: transactions.length,
      flaggedCount: flagged.length,
      fraudRate,
    },
  };

  // Only return the first error. To be discussed whether we want to return all errors.
  if (errors.length > 0) report.errors = [errors[0]];

  return report;
}
