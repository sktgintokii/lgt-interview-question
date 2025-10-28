# Base Test Cases
 
## Test Case Inputs
 
```javascript
// Test Case 1: Normal Transaction
const transactions = [
  "txn_1,user_1,25,2024-01-15T14:30:00Z,Chicago"
];
 
// Test Case 2: High Amount Only
const transactions = [
  "txn_1,user_1,5000,2024-01-15T14:30:00Z,Chicago"
];
 
// Test Case 3: Rapid Transactions (3 transactions within 5 minutes)
const transactions = [
  "txn_1,user_1,100,2024-01-15T10:00:00Z,New York",
  "txn_2,user_1,150,2024-01-15T10:01:00Z,New York",
  "txn_3,user_1,200,2024-01-15T10:02:00Z,New York"
];
 
// Test Case 4: Multiple Rules Example
const transactions = [
  "txn_1,user_1,150,2024-01-15T10:30:00Z,New York",
  "txn_2,user_1,2500,2024-01-15T10:35:00Z,Beijing", // High amount!
  "txn_3,user_2,75,2024-01-15T11:00:00Z,London",
  "txn_4,user_1,50,2024-01-15T10:32:00Z,New York",  // Rapid transaction!
  "txn_5,user_1,200,2024-01-15T10:33:00Z,New York"  // Rapid transaction!
];
 
```
 