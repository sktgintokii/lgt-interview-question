# 🎯 AI Fraud Detection System

## The Story

You're a software engineer at **Fraud Watcher**! Your mission is to build a fraud detection system that analyzes transaction patterns to identify suspicious activities.

## Your Mission

Create a `detectFraud()` function that:

- 🔍 **Check fraud detection rules**
- 📊 **Calculates risk scores** for each transaction
- 🚨 **Returns flagged transactions** with confidence levels

## The Transaction Data

Each transaction is represented as a comma-separated string with the following format:
`transactionId,userId,amount,timestamp,location`

```javascript
const transactions = [
  "txn_001,user_123,150,2024-01-15T10:30:00Z,New York",
  "txn_002,user_123,2500,2024-01-15T10:35:00Z,Beijing", // High amount!
  "txn_003,user_456,75,2024-01-15T11:00:00Z,London",
  "txn_004,user_123,50,2024-01-15T10:32:00Z,New York", // Rapid transaction!
  "txn_005,user_123,200,2024-01-15T10:33:00Z,New York", // Rapid transaction!
  // ... more transactions
];
```

## The Rule Engine

Implement fraud detection rules that return risk scores (0-100). All rules are part of a unified rule engine.

| Rule Name               | Function            | Condition                                    | Risk Score |
| ----------------------- | ------------------- | -------------------------------------------- | ---------- |
| High Amount Rule        | `highAmount`        | Transaction amount > $1,000                  | 70 points  |
| Rapid Transactions Rule | `rapidTransactions` | User makes >=3 transactions within 5 minutes | 60 points  |

**Important**: For the Rapid Transactions rule, flag ALL transactions that are part of a rapid sequence (≥3 transactions within 5 minutes), not just the ones that exceed the threshold.

**Note**: Additional rules (Amount Anomaly, Time Pattern, Location Anomaly) are available in the bonus challenge.

## Expected Output

Your function should return fraud analysis results:

```javascript
detectFraud(transactions);
// => {
//   flagged: [
//     {
//       transactionId: "txn_002",
//       userId: "user_123",
//       riskScore: 70, // 70 (highAmount)
//       reasons: ["highAmount"]
//     },
//     {
//       transactionId: "txn_001",
//       userId: "user_123",
//       riskScore: 60, // 60 (rapidTransactions)
//       reasons: ["rapidTransactions"]
//     },
//     {
//       transactionId: "txn_004",
//       userId: "user_123",
//       riskScore: 60, // 60 (rapidTransactions)
//       reasons: ["rapidTransactions"]
//     },
//     {
//       transactionId: "txn_005",
//       userId: "user_123",
//       riskScore: 60, // 60 (rapidTransactions)
//       reasons: ["rapidTransactions"]
//     }
//   ],
//   summary: {
//     totalTransactions: 5,
//     flaggedCount: 4, // txn_002 (highAmount), txn_001, txn_004, txn_005 (rapidTransactions)
//     fraudRate: 0.8
//   }
// }
```

## Scoring Logic

- **Final Score**: Sum of all triggered rule scores (0-100+)
- **Threshold**: Flag transactions with final score > 50

## Time Limit

You have **45 minutes** to complete this fraud detection challenge!

Good luck ! 🔍✨

## Markdown viewer

```
npx mdts
```
