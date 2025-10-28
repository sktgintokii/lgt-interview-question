## Test Case Inputs
 
```javascript
// Edge Case 1: Empty Data
const transactions = [];
 
// Edge Case 2: Invalid Data
const transactions = [
  "txn_1,user_1,100,invalid-date,New York", // Invalid timestamp
  "txn_5,user_5,not-a-number,2024-01-15T10:30:00Z,New York" // Invalid number
];
 
// Edge Case 3: Missing Fields
const transactions = [
  "txn_1,user_1,,2024-01-15T10:30:00Z,New York",
  "txn_2,user_2,100,2024-01-15T10:30:00Z,",
  "txn_3,user_3,100,,New York",
  "txn_4,user_4,100,2024-01-15T10:30:00Z,New York"
];
 
// Edge Case 4: Parsing Errors
const transactions = [
  "txn_1,user_1,1500,2024-01-15T10:30:00Z,New York",
  "txn_2,user_2,100,,2024-01-15T10:30:00Z,,New York," // Extra commas
];
```
 