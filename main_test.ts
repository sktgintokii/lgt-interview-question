import { assertEquals } from "@std/assert";
import { detectFraud } from "./main.ts";

Deno.test(function test1() {
  const transactions = ["txn_1,user_1,25,2024-01-15T14:30:00Z,Chicago"];

  const report = detectFraud(transactions);
  assertEquals(report, {
    flagged: [],
    summary: { totalTransactions: 1, flaggedCount: 0, fraudRate: 0 },
  });
});

Deno.test(function test2() {
  const transactions = ["txn_1,user_1,5000,2024-01-15T14:30:00Z,Chicago"];

  const report = detectFraud(transactions);
  assertEquals(report, {
    flagged: [
      {
        transactionId: "txn_1",
        userId: "user_1",
        riskScore: 70,
        reasons: ["highAmount"],
      },
    ],
    summary: { totalTransactions: 1, flaggedCount: 1, fraudRate: 1 },
  });
});

Deno.test(function test3() {
  const transactions = [
    "txn_1,user_1,100,2024-01-15T10:00:00Z,New York",
    "txn_2,user_1,150,2024-01-15T10:01:00Z,New York",
    "txn_3,user_1,200,2024-01-15T10:02:00Z,New York",
  ];

  const report = detectFraud(transactions);
  assertEquals(report, {
    flagged: [
      {
        transactionId: "txn_1",
        userId: "user_1",
        riskScore: 60,
        reasons: ["rapidTransactions"],
      },
      {
        transactionId: "txn_2",
        userId: "user_1",
        riskScore: 60,
        reasons: ["rapidTransactions"],
      },
      {
        transactionId: "txn_3",
        userId: "user_1",
        riskScore: 60,
        reasons: ["rapidTransactions"],
      },
    ],
    summary: { totalTransactions: 3, flaggedCount: 3, fraudRate: 1 },
  });
});

Deno.test(function test4() {
  const transactions = [
    "txn_1,user_1,150,2024-01-15T10:30:00Z,New York",
    "txn_2,user_1,2500,2024-01-15T10:35:00Z,Beijing", // High amount!
    "txn_3,user_2,75,2024-01-15T11:00:00Z,London",
    "txn_4,user_1,50,2024-01-15T10:32:00Z,New York", // Rapid transaction!
    "txn_5,user_1,200,2024-01-15T10:33:00Z,New York", // Rapid transaction!
  ];

  const report = detectFraud(transactions);

  assertEquals(report, {
    flagged: [
      {
        transactionId: "txn_1",
        userId: "user_1",
        riskScore: 60,
        reasons: ["rapidTransactions"],
      },
      {
        transactionId: "txn_2",
        userId: "user_1",
        riskScore: 130,
        reasons: ["highAmount", "rapidTransactions"],
      },
      {
        transactionId: "txn_4",
        userId: "user_1",
        riskScore: 60,
        reasons: ["rapidTransactions"],
      },
      {
        transactionId: "txn_5",
        userId: "user_1",
        riskScore: 60,
        reasons: ["rapidTransactions"],
      },
    ],
    summary: { totalTransactions: 5, flaggedCount: 4, fraudRate: 0.8 },
  });
});

Deno.test(function edgeCase1() {
  const transactions: string[] = [];

  const report = detectFraud(transactions);
  assertEquals(report, {
    flagged: [],
    summary: { totalTransactions: 0, flaggedCount: 0, fraudRate: 0 },
  });
});

Deno.test(function edgeCase2() {
  const transactions = [
    "txn_1,user_1,100,invalid-date,New York", // Invalid timestamp
    "txn_5,user_5,not-a-number,2024-01-15T10:30:00Z,New York", // Invalid number
  ];

  const report = detectFraud(transactions);
  assertEquals(report, {
    flagged: [],
    summary: { totalTransactions: 2, flaggedCount: 0, fraudRate: 0 },
    errors: ["Invalid data detected in transactions"],
  });
});

Deno.test(function edgeCase3() {
  const transactions = [
    "txn_1,user_1,,2024-01-15T10:30:00Z,New York",
    "txn_2,user_2,100,2024-01-15T10:30:00Z,",
    "txn_3,user_3,100,,New York",
    "txn_4,user_4,100,2024-01-15T10:30:00Z,New York",
  ];

  const report = detectFraud(transactions);
  assertEquals(report, {
    flagged: [],
    summary: { totalTransactions: 4, flaggedCount: 0, fraudRate: 0 },
    errors: ["Invalid data detected in transactions"],
  });
});
