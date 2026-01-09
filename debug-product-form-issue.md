# Debug: Product Form Issue

## Problem Found
Form validation is rejecting product creation because dimensions (width, height, depth, weight) are required to be > 0, but they default to 0.

## Error from Console
```
TRPCClientError: [
  {
    "code": "too_small",
    "minimum": 0,
    "inclusive": false,
    "path": ["width"],
    "message": "Too small: expected number to be >0"
  },
  // Same for height, depth, weight
]
```

## Root Cause
The tRPC procedure `products.create` has validation that requires:
- width > 0
- height > 0  
- depth > 0
- weight > 0

But these fields are optional in the UI (no asterisk *), and default to 0 when empty.

## Solution Options
1. Make dimensions optional in backend validation (allow 0 or null)
2. Make dimensions required in frontend UI (add asterisk and validation)
3. Change default value from 0 to undefined/null in form

Best approach: Make dimensions optional since not all furniture needs exact dimensions.
