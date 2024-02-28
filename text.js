function calculateIncrease(amount) {
  return amount * (8 / 100) + amount;
}

// Example usage:
let originalAmount = 234;
let increasedAmount = calculateIncrease(originalAmount);

console.log("Original Amount:", originalAmount);
console.log("Increased Amount:", increasedAmount);
