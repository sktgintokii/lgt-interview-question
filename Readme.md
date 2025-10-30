# AI Fraud Detection

Lightweight fraud detection demo implemented for the interview challenge. Implements a rule engine that analyzes transaction strings and returns flagged transactions with risk scores and reasons.

## Quickstart

Prerequisite: install Deno (see https://deno.land).

Run the test suite:

```sh
deno test
```

Run the project in watch/dev mode (task defined in deno.json):

```sh
deno task dev
```

Run a single test file:

```sh
deno test main_test.ts  # or any other test file
```

### API

Primary entry: detectFraud — see implementation in main.ts.
Input: string[] where each string is transactionId,userId,amount,timestamp,location.
Output: fraud report object with flagged array and summary (and optional errors).

Example output shape (see [problemStatement.md] for details):

```ts
{
  "flagged": [
    {
      "transactionId": "txn_002",
      "userId": "user_123",
      "riskScore": 70,
      "reasons": ["highAmount"]
    }
  ],
  "summary": {
    "totalTransactions": 1,
    "flaggedCount": 1,
    "fraudRate": 1
  }
}
```

### Rules implemented

- High Amount — highAmount: amount > $1,000 → 70 points
- Rapid Transactions — rapidTransactions: user makes ≥3 transactions within 5 minutes → 60 points (all transactions in the rapid sequence are flagged)

Threshold: transactions with final score > 50 are returned in flagged. See the full spec in [problemStatement.md].

## Tests & Examples

- Unit tests: [main_test.ts] — covers normal, high-amount, rapid transactions and edge cases.
- Sample test cases: [testCases.md]
- Edge cases: [edgeCases.md]

## Troubleshooting

If tests fail due to parsing errors, check input strings for missing fields or invalid values (timestamp/amount). Tests assert an errors array for invalid data cases in main_test.ts.
