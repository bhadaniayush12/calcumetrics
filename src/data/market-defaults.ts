/**
 * market-defaults.ts — Realistic market defaults per calculator for INR, USD, EUR, and GBP.
 *
 * Each calculator defines realistic baseline numbers for:
 * - INR (Indian Rupee): ₹ amounts, RBI/Indian interest rates
 * - USD (US Dollar): $ amounts, US Federal Reserve / Treasury / S&P baseline rates
 * - EUR (Euro): € amounts, ECB baseline rates
 * - GBP (British Pound): £ amounts, Bank of England baseline rates
 *
 * Values can be edited directly here at any time.
 */
import type { CurrencyCode } from '../lib/currency';

export interface FieldDefaults {
  value: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface MarketField {
  label: string;
  kind: 'amount' | 'rate';
  INR: FieldDefaults;
  USD?: FieldDefaults;
  EUR?: FieldDefaults;
  GBP?: FieldDefaults;
}

export interface PresetChip {
  val: number;
  label: string;
}

export type CalculatorDefaults = Record<string, MarketField>;

export const MARKET_DEFAULTS = {
  "break-even": {
    "be-fixed": {
      "label": "Total Fixed Costs",
      "kind": "amount",
      "INR": {
        "value": 500000,
        "min": 10000,
        "max": 5000000,
        "step": 10000
      },
      "USD": {
        "value": 50000,
        "min": 2000,
        "max": 500000,
        "step": 1000
      },
      "EUR": {
        "value": 45000,
        "min": 2000,
        "max": 500000,
        "step": 1000
      },
      "GBP": {
        "value": 40000,
        "min": 2000,
        "max": 400000,
        "step": 1000
      }
    },
    "be-price": {
      "label": "Selling Price per Unit",
      "kind": "amount",
      "INR": {
        "value": 500,
        "min": 10,
        "max": 25000,
        "step": 10
      },
      "USD": {
        "value": 50,
        "min": 2,
        "max": 2500,
        "step": 1
      },
      "EUR": {
        "value": 45,
        "min": 2,
        "max": 2500,
        "step": 1
      },
      "GBP": {
        "value": 40,
        "min": 2,
        "max": 2000,
        "step": 1
      }
    },
    "be-variable": {
      "label": "Variable Cost per Unit",
      "kind": "amount",
      "INR": {
        "value": 300,
        "min": 5,
        "max": 20000,
        "step": 5
      },
      "USD": {
        "value": 30,
        "min": 1,
        "max": 2000,
        "step": 1
      },
      "EUR": {
        "value": 27,
        "min": 1,
        "max": 2000,
        "step": 1
      },
      "GBP": {
        "value": 24,
        "min": 1,
        "max": 1500,
        "step": 1
      }
    }
  },
  "cagr": {
    "cagr-pv": {
      "label": "Initial Investment (Starting Value)",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 5000,
        "max": 10000000,
        "step": 5000
      },
      "USD": {
        "value": 10000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "EUR": {
        "value": 10000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "GBP": {
        "value": 10000,
        "min": 500,
        "max": 500000,
        "step": 500
      }
    },
    "cagr-fv": {
      "label": "Final Value (Ending Value)",
      "kind": "amount",
      "INR": {
        "value": 250000,
        "min": 5000,
        "max": 50000000,
        "step": 10000
      },
      "USD": {
        "value": 25000,
        "min": 500,
        "max": 1000000,
        "step": 1000
      },
      "EUR": {
        "value": 25000,
        "min": 500,
        "max": 1000000,
        "step": 1000
      },
      "GBP": {
        "value": 25000,
        "min": 500,
        "max": 1000000,
        "step": 1000
      }
    }
  },
  "car-loan": {
    "cl-price": {
      "label": "On-Road Vehicle Price",
      "kind": "amount",
      "INR": {
        "value": 1200000,
        "min": 200000,
        "max": 10000000,
        "step": 25000
      },
      "USD": {
        "value": 35000,
        "min": 5000,
        "max": 150000,
        "step": 1000
      },
      "EUR": {
        "value": 30000,
        "min": 5000,
        "max": 120000,
        "step": 1000
      },
      "GBP": {
        "value": 25000,
        "min": 5000,
        "max": 100000,
        "step": 1000
      }
    },
    "cl-down": {
      "label": "Down Payment",
      "kind": "amount",
      "INR": {
        "value": 200000,
        "min": 0,
        "max": 5000000,
        "step": 25000
      },
      "USD": {
        "value": 5000,
        "min": 0,
        "max": 50000,
        "step": 500
      },
      "EUR": {
        "value": 5000,
        "min": 0,
        "max": 40000,
        "step": 500
      },
      "GBP": {
        "value": 4000,
        "min": 0,
        "max": 35000,
        "step": 500
      }
    },
    "cl-rate": {
      "label": "Annual Interest Rate",
      "kind": "rate",
      "INR": {
        "value": 9,
        "min": 5,
        "max": 20,
        "step": 0.25
      },
      "USD": {
        "value": 6.5,
        "min": 2,
        "max": 18,
        "step": 0.25
      },
      "EUR": {
        "value": 5.5,
        "min": 2,
        "max": 15,
        "step": 0.25
      },
      "GBP": {
        "value": 6,
        "min": 2,
        "max": 16,
        "step": 0.25
      }
    }
  },
  "cash-conversion-cycle": {
    "ccc-ar": {
      "label": "Accounts Receivable",
      "kind": "amount",
      "INR": {
        "value": 200000
      },
      "USD": {
        "value": 25000
      },
      "EUR": {
        "value": 25000
      },
      "GBP": {
        "value": 20000
      }
    },
    "ccc-rev": {
      "label": "Annual Revenue / Net Sales",
      "kind": "amount",
      "INR": {
        "value": 2000000
      },
      "USD": {
        "value": 300000
      },
      "EUR": {
        "value": 300000
      },
      "GBP": {
        "value": 250000
      }
    },
    "ccc-inv": {
      "label": "Inventory Value",
      "kind": "amount",
      "INR": {
        "value": 300000
      },
      "USD": {
        "value": 40000
      },
      "EUR": {
        "value": 40000
      },
      "GBP": {
        "value": 35000
      }
    },
    "ccc-cogs": {
      "label": "Cost of Goods Sold (COGS)",
      "kind": "amount",
      "INR": {
        "value": 1200000
      },
      "USD": {
        "value": 180000
      },
      "EUR": {
        "value": 180000
      },
      "GBP": {
        "value": 150000
      }
    },
    "ccc-ap": {
      "label": "Accounts Payable",
      "kind": "amount",
      "INR": {
        "value": 150000
      },
      "USD": {
        "value": 20000
      },
      "EUR": {
        "value": 20000
      },
      "GBP": {
        "value": 18000
      }
    }
  },
  "cogs": {
    "cogs-beginning": {
      "label": "Beginning Inventory",
      "kind": "amount",
      "INR": {
        "value": 150000
      },
      "USD": {
        "value": 20000
      },
      "EUR": {
        "value": 20000
      },
      "GBP": {
        "value": 15000
      }
    },
    "cogs-purchases": {
      "label": "Purchases (Raw Materials)",
      "kind": "amount",
      "INR": {
        "value": 450000
      },
      "USD": {
        "value": 60000
      },
      "EUR": {
        "value": 60000
      },
      "GBP": {
        "value": 50000
      }
    },
    "cogs-labor": {
      "label": "Direct Labor",
      "kind": "amount",
      "INR": {
        "value": 100000
      },
      "USD": {
        "value": 15000
      },
      "EUR": {
        "value": 15000
      },
      "GBP": {
        "value": 12000
      }
    },
    "cogs-overhead": {
      "label": "Direct Overhead / Freight",
      "kind": "amount",
      "INR": {
        "value": 50000
      },
      "USD": {
        "value": 8000
      },
      "EUR": {
        "value": 8000
      },
      "GBP": {
        "value": 6000
      }
    },
    "cogs-ending": {
      "label": "Ending Inventory",
      "kind": "amount",
      "INR": {
        "value": 120000
      },
      "USD": {
        "value": 18000
      },
      "EUR": {
        "value": 18000
      },
      "GBP": {
        "value": 14000
      }
    },
    "cogs-revenue": {
      "label": "Gross Revenue (Optional)",
      "kind": "amount",
      "INR": {
        "value": 950000
      },
      "USD": {
        "value": 130000
      },
      "EUR": {
        "value": 130000
      },
      "GBP": {
        "value": 110000
      }
    }
  },
  "compound-interest": {
    "ci-principal": {
      "label": "Initial Principal",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 1000,
        "max": 10000000,
        "step": 1000
      },
      "USD": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 100
      },
      "EUR": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 100
      },
      "GBP": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 100
      }
    },
    "ci-rate": {
      "label": "Annual Interest Rate",
      "kind": "rate",
      "INR": {
        "value": 8,
        "min": 1,
        "max": 30,
        "step": 0.25
      },
      "USD": {
        "value": 7,
        "min": 1,
        "max": 20,
        "step": 0.25
      },
      "EUR": {
        "value": 6,
        "min": 1,
        "max": 20,
        "step": 0.25
      },
      "GBP": {
        "value": 6,
        "min": 1,
        "max": 20,
        "step": 0.25
      }
    }
  },
  "credit-card-payoff": {
    "cc-balance": {
      "label": "Current Credit Card Balance",
      "kind": "amount",
      "INR": {
        "value": 150000,
        "min": 5000,
        "max": 2000000,
        "step": 5000
      },
      "USD": {
        "value": 6000,
        "min": 500,
        "max": 50000,
        "step": 250
      },
      "EUR": {
        "value": 5000,
        "min": 500,
        "max": 40000,
        "step": 250
      },
      "GBP": {
        "value": 4000,
        "min": 500,
        "max": 35000,
        "step": 250
      }
    },
    "cc-apr": {
      "label": "Annual Percentage Rate (APR)",
      "kind": "rate",
      "INR": {
        "value": 36,
        "min": 10,
        "max": 50,
        "step": 0.5
      },
      "USD": {
        "value": 22,
        "min": 8,
        "max": 36,
        "step": 0.25
      },
      "EUR": {
        "value": 18,
        "min": 6,
        "max": 32,
        "step": 0.25
      },
      "GBP": {
        "value": 20,
        "min": 8,
        "max": 34,
        "step": 0.25
      }
    },
    "cc-payment": {
      "label": "Monthly Payment Amount",
      "kind": "amount",
      "INR": {
        "value": 10000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "USD": {
        "value": 250,
        "min": 25,
        "max": 5000,
        "step": 25
      },
      "EUR": {
        "value": 200,
        "min": 25,
        "max": 4000,
        "step": 25
      },
      "GBP": {
        "value": 180,
        "min": 20,
        "max": 3500,
        "step": 20
      }
    }
  },
  "dcf": {
    "dcf-fcf1": {
      "label": "Year 1 Free Cash Flow",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 1000,
        "max": 10000000,
        "step": 5000
      },
      "USD": {
        "value": 50000,
        "min": 1000,
        "max": 1000000,
        "step": 1000
      },
      "EUR": {
        "value": 50000,
        "min": 1000,
        "max": 1000000,
        "step": 1000
      },
      "GBP": {
        "value": 40000,
        "min": 1000,
        "max": 1000000,
        "step": 1000
      }
    },
    "dcf-growth": {
      "label": "Growth Rate (Years 1-5)",
      "kind": "rate",
      "INR": {
        "value": 10,
        "min": 0,
        "max": 50,
        "step": 0.5
      },
      "USD": {
        "value": 8,
        "min": 0,
        "max": 40,
        "step": 0.5
      },
      "EUR": {
        "value": 7,
        "min": 0,
        "max": 40,
        "step": 0.5
      },
      "GBP": {
        "value": 7,
        "min": 0,
        "max": 40,
        "step": 0.5
      }
    },
    "dcf-discount": {
      "label": "Discount Rate (WACC / Hurdle)",
      "kind": "rate",
      "INR": {
        "value": 12,
        "min": 1,
        "max": 30,
        "step": 0.5
      },
      "USD": {
        "value": 9,
        "min": 1,
        "max": 25,
        "step": 0.25
      },
      "EUR": {
        "value": 8.5,
        "min": 1,
        "max": 25,
        "step": 0.25
      },
      "GBP": {
        "value": 8.5,
        "min": 1,
        "max": 25,
        "step": 0.25
      }
    },
    "dcf-terminal": {
      "label": "Terminal Growth Rate (Perpetual)",
      "kind": "rate",
      "INR": {
        "value": 3,
        "min": 0,
        "max": 10,
        "step": 0.25
      },
      "USD": {
        "value": 2.5,
        "min": 0,
        "max": 8,
        "step": 0.25
      },
      "EUR": {
        "value": 2,
        "min": 0,
        "max": 8,
        "step": 0.25
      },
      "GBP": {
        "value": 2,
        "min": 0,
        "max": 8,
        "step": 0.25
      }
    }
  },
  "debt-to-income-ratio": {
    "dti-debt": {
      "label": "Monthly Debt Payments",
      "kind": "amount",
      "INR": {
        "value": 30000,
        "min": 0,
        "max": 500000,
        "step": 1000
      },
      "USD": {
        "value": 1500,
        "min": 0,
        "max": 15000,
        "step": 50
      },
      "EUR": {
        "value": 1200,
        "min": 0,
        "max": 12000,
        "step": 50
      },
      "GBP": {
        "value": 1000,
        "min": 0,
        "max": 10000,
        "step": 50
      }
    },
    "dti-income": {
      "label": "Gross Monthly Income",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 10000,
        "max": 2000000,
        "step": 5000
      },
      "USD": {
        "value": 6000,
        "min": 1000,
        "max": 50000,
        "step": 250
      },
      "EUR": {
        "value": 4500,
        "min": 1000,
        "max": 40000,
        "step": 250
      },
      "GBP": {
        "value": 4000,
        "min": 1000,
        "max": 35000,
        "step": 200
      }
    }
  },
  "depreciation": {
    "dep-cost": {
      "label": "Asset Initial Cost",
      "kind": "amount",
      "INR": {
        "value": 500000,
        "min": 1000,
        "max": 100000000,
        "step": 10000
      },
      "USD": {
        "value": 50000,
        "min": 500,
        "max": 5000000,
        "step": 1000
      },
      "EUR": {
        "value": 50000,
        "min": 500,
        "max": 5000000,
        "step": 1000
      },
      "GBP": {
        "value": 40000,
        "min": 500,
        "max": 4000000,
        "step": 1000
      }
    },
    "dep-salvage": {
      "label": "Salvage (Scrap) Value",
      "kind": "amount",
      "INR": {
        "value": 50000,
        "min": 0,
        "max": 10000000,
        "step": 5000
      },
      "USD": {
        "value": 5000,
        "min": 0,
        "max": 500000,
        "step": 500
      },
      "EUR": {
        "value": 5000,
        "min": 0,
        "max": 500000,
        "step": 500
      },
      "GBP": {
        "value": 4000,
        "min": 0,
        "max": 400000,
        "step": 500
      }
    }
  },
  "discounted-payback-period": {
    "dpp-invest": {
      "label": "Initial Investment Cost",
      "kind": "amount",
      "INR": {
        "value": 500000,
        "min": 1000,
        "max": 100000000,
        "step": 10000
      },
      "USD": {
        "value": 50000,
        "min": 500,
        "max": 5000000,
        "step": 1000
      },
      "EUR": {
        "value": 50000,
        "min": 500,
        "max": 5000000,
        "step": 1000
      },
      "GBP": {
        "value": 40000,
        "min": 500,
        "max": 4000000,
        "step": 1000
      }
    },
    "dpp-rate": {
      "label": "Discount Rate",
      "kind": "rate",
      "INR": {
        "value": 10,
        "min": 1,
        "max": 30,
        "step": 0.5
      },
      "USD": {
        "value": 8,
        "min": 1,
        "max": 25,
        "step": 0.25
      },
      "EUR": {
        "value": 7,
        "min": 1,
        "max": 20,
        "step": 0.25
      },
      "GBP": {
        "value": 7,
        "min": 1,
        "max": 20,
        "step": 0.25
      }
    }
  },
  "dscr": {
    "dscr-noi": {
      "label": "Net Operating Income (NOI)",
      "kind": "amount",
      "INR": {
        "value": 1500000,
        "min": 10000,
        "max": 100000000,
        "step": 50000
      },
      "USD": {
        "value": 150000,
        "min": 5000,
        "max": 5000000,
        "step": 5000
      },
      "EUR": {
        "value": 150000,
        "min": 5000,
        "max": 5000000,
        "step": 5000
      },
      "GBP": {
        "value": 120000,
        "min": 5000,
        "max": 4000000,
        "step": 5000
      }
    },
    "dscr-debt": {
      "label": "Annual Debt Service",
      "kind": "amount",
      "INR": {
        "value": 1000000,
        "min": 1000,
        "max": 100000000,
        "step": 25000
      },
      "USD": {
        "value": 100000,
        "min": 1000,
        "max": 5000000,
        "step": 2500
      },
      "EUR": {
        "value": 100000,
        "min": 1000,
        "max": 5000000,
        "step": 2500
      },
      "GBP": {
        "value": 80000,
        "min": 1000,
        "max": 4000000,
        "step": 2000
      }
    }
  },
  "emi": {
    "emi-principal": {
      "label": "Loan Amount",
      "kind": "amount",
      "INR": {
        "value": 1000000,
        "min": 10000,
        "max": 10000000,
        "step": 10000
      },
      "USD": {
        "value": 25000,
        "min": 1000,
        "max": 250000,
        "step": 1000
      },
      "EUR": {
        "value": 25000,
        "min": 1000,
        "max": 250000,
        "step": 1000
      },
      "GBP": {
        "value": 20000,
        "min": 1000,
        "max": 200000,
        "step": 1000
      }
    },
    "emi-rate": {
      "label": "Interest Rate (p.a.)",
      "kind": "rate",
      "INR": {
        "value": 8.5,
        "min": 5,
        "max": 25,
        "step": 0.25
      },
      "USD": {
        "value": 6.5,
        "min": 2,
        "max": 20,
        "step": 0.25
      },
      "EUR": {
        "value": 4.5,
        "min": 1.5,
        "max": 15,
        "step": 0.25
      },
      "GBP": {
        "value": 5.5,
        "min": 2,
        "max": 16,
        "step": 0.25
      }
    }
  },
  "eoq": {
    "eoq-order-cost": {
      "label": "Order Cost (S)",
      "kind": "amount",
      "INR": {
        "value": 500,
        "min": 1,
        "max": 50000,
        "step": 10
      },
      "USD": {
        "value": 50,
        "min": 1,
        "max": 5000,
        "step": 1
      },
      "EUR": {
        "value": 45,
        "min": 1,
        "max": 5000,
        "step": 1
      },
      "GBP": {
        "value": 40,
        "min": 1,
        "max": 4000,
        "step": 1
      }
    },
    "eoq-holding-cost": {
      "label": "Holding Cost per Unit (H)",
      "kind": "amount",
      "INR": {
        "value": 25,
        "min": 0.1,
        "max": 5000,
        "step": 0.5
      },
      "USD": {
        "value": 3,
        "min": 0.1,
        "max": 500,
        "step": 0.1
      },
      "EUR": {
        "value": 3,
        "min": 0.1,
        "max": 500,
        "step": 0.1
      },
      "GBP": {
        "value": 2.5,
        "min": 0.1,
        "max": 400,
        "step": 0.1
      }
    }
  },
  "fd": {
    "fd-principal": {
      "label": "Principal Amount",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 10000,
        "max": 10000000,
        "step": 10000
      },
      "USD": {
        "value": 10000,
        "min": 1000,
        "max": 250000,
        "step": 1000
      },
      "EUR": {
        "value": 10000,
        "min": 1000,
        "max": 250000,
        "step": 1000
      },
      "GBP": {
        "value": 10000,
        "min": 1000,
        "max": 250000,
        "step": 1000
      }
    },
    "fd-rate": {
      "label": "Interest Rate (% p.a.)",
      "kind": "rate",
      "INR": {
        "value": 7.1,
        "min": 3,
        "max": 12,
        "step": 0.1
      },
      "USD": {
        "value": 4.5,
        "min": 1,
        "max": 9,
        "step": 0.1
      },
      "EUR": {
        "value": 3,
        "min": 0.5,
        "max": 8,
        "step": 0.1
      },
      "GBP": {
        "value": 4.2,
        "min": 1,
        "max": 9,
        "step": 0.1
      }
    }
  },
  "future-value": {
    "fv-present": {
      "label": "Present Value (Initial Amount)",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 1000,
        "max": 10000000,
        "step": 5000
      },
      "USD": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 500
      },
      "EUR": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 500
      },
      "GBP": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 500
      }
    },
    "fv-rate": {
      "label": "Interest Rate per Period",
      "kind": "rate",
      "INR": {
        "value": 8,
        "min": 0.1,
        "max": 30,
        "step": 0.1
      },
      "USD": {
        "value": 7,
        "min": 0.1,
        "max": 20,
        "step": 0.1
      },
      "EUR": {
        "value": 6,
        "min": 0.1,
        "max": 20,
        "step": 0.1
      },
      "GBP": {
        "value": 6,
        "min": 0.1,
        "max": 20,
        "step": 0.1
      }
    }
  },
  "home-loan": {
    "hl-price": {
      "label": "Property Purchase Price",
      "kind": "amount",
      "INR": {
        "value": 5000000,
        "min": 500000,
        "max": 50000000,
        "step": 100000
      },
      "USD": {
        "value": 400000,
        "min": 50000,
        "max": 2000000,
        "step": 10000
      },
      "EUR": {
        "value": 350000,
        "min": 50000,
        "max": 1500000,
        "step": 10000
      },
      "GBP": {
        "value": 300000,
        "min": 50000,
        "max": 1500000,
        "step": 10000
      }
    },
    "hl-down": {
      "label": "Down Payment",
      "kind": "rate",
      "INR": {
        "value": 20,
        "min": 10,
        "max": 90,
        "step": 1
      },
      "USD": {
        "value": 20,
        "min": 5,
        "max": 90,
        "step": 1
      },
      "EUR": {
        "value": 20,
        "min": 5,
        "max": 90,
        "step": 1
      },
      "GBP": {
        "value": 20,
        "min": 5,
        "max": 90,
        "step": 1
      }
    },
    "hl-rate": {
      "label": "Annual Interest Rate",
      "kind": "rate",
      "INR": {
        "value": 8.5,
        "min": 5,
        "max": 18,
        "step": 0.05
      },
      "USD": {
        "value": 6.75,
        "min": 2,
        "max": 14,
        "step": 0.05
      },
      "EUR": {
        "value": 3.8,
        "min": 1,
        "max": 10,
        "step": 0.05
      },
      "GBP": {
        "value": 4.8,
        "min": 1,
        "max": 12,
        "step": 0.05
      }
    }
  },
  "inflation": {
    "inf-amount": {
      "label": "Current Amount",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 1000,
        "max": 10000000,
        "step": 5000
      },
      "USD": {
        "value": 5000,
        "min": 100,
        "max": 250000,
        "step": 100
      },
      "EUR": {
        "value": 4000,
        "min": 100,
        "max": 200000,
        "step": 100
      },
      "GBP": {
        "value": 3500,
        "min": 100,
        "max": 200000,
        "step": 100
      }
    },
    "inf-rate": {
      "label": "Inflation Rate (% p.a.)",
      "kind": "rate",
      "INR": {
        "value": 6,
        "min": 0.1,
        "max": 25,
        "step": 0.1
      },
      "USD": {
        "value": 3,
        "min": 0.1,
        "max": 15,
        "step": 0.1
      },
      "EUR": {
        "value": 2.5,
        "min": 0.1,
        "max": 15,
        "step": 0.1
      },
      "GBP": {
        "value": 3,
        "min": 0.1,
        "max": 15,
        "step": 0.1
      }
    }
  },
  "interest-rate": {
    "ir-principal": {
      "label": "Loan Amount",
      "kind": "amount",
      "INR": {
        "value": 500000,
        "min": 10000,
        "max": 10000000,
        "step": 10000
      },
      "USD": {
        "value": 20000,
        "min": 1000,
        "max": 200000,
        "step": 1000
      },
      "EUR": {
        "value": 20000,
        "min": 1000,
        "max": 200000,
        "step": 1000
      },
      "GBP": {
        "value": 15000,
        "min": 1000,
        "max": 150000,
        "step": 1000
      }
    },
    "ir-emi": {
      "label": "Monthly EMI Payment",
      "kind": "amount",
      "INR": {
        "value": 12000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "USD": {
        "value": 450,
        "min": 25,
        "max": 10000,
        "step": 25
      },
      "EUR": {
        "value": 420,
        "min": 25,
        "max": 10000,
        "step": 25
      },
      "GBP": {
        "value": 350,
        "min": 20,
        "max": 8000,
        "step": 20
      }
    }
  },
  "inventory-turnover": {
    "it-cogs": {
      "label": "Cost of Goods Sold (COGS)",
      "kind": "amount",
      "INR": {
        "value": 800000
      },
      "USD": {
        "value": 100000
      },
      "EUR": {
        "value": 100000
      },
      "GBP": {
        "value": 80000
      }
    },
    "it-beg": {
      "label": "Beginning Inventory",
      "kind": "amount",
      "INR": {
        "value": 120000
      },
      "USD": {
        "value": 15000
      },
      "EUR": {
        "value": 15000
      },
      "GBP": {
        "value": 12000
      }
    },
    "it-end": {
      "label": "Ending Inventory",
      "kind": "amount",
      "INR": {
        "value": 80000
      },
      "USD": {
        "value": 10000
      },
      "EUR": {
        "value": 10000
      },
      "GBP": {
        "value": 8000
      }
    }
  },
  "irr": {
    "irr-initial": {
      "label": "Initial Investment (Year 0 Outflow)",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 1000,
        "max": 10000000,
        "step": 5000
      },
      "USD": {
        "value": 25000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "EUR": {
        "value": 25000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "GBP": {
        "value": 20000,
        "min": 500,
        "max": 400000,
        "step": 500
      }
    },
    "irr-hurdle": {
      "label": "Hurdle Rate / Cost of Capital",
      "kind": "rate",
      "INR": {
        "value": 12,
        "min": 1,
        "max": 30,
        "step": 0.5
      },
      "USD": {
        "value": 9,
        "min": 1,
        "max": 25,
        "step": 0.25
      },
      "EUR": {
        "value": 8.5,
        "min": 1,
        "max": 25,
        "step": 0.25
      },
      "GBP": {
        "value": 8.5,
        "min": 1,
        "max": 25,
        "step": 0.25
      }
    },
    "irr-cf1": {
      "label": "Year 1 Cash Flow",
      "kind": "amount",
      "INR": {
        "value": 30000
      },
      "USD": {
        "value": 7500
      },
      "EUR": {
        "value": 7500
      },
      "GBP": {
        "value": 6000
      }
    },
    "irr-cf2": {
      "label": "Year 2 Cash Flow",
      "kind": "amount",
      "INR": {
        "value": 40000
      },
      "USD": {
        "value": 10000
      },
      "EUR": {
        "value": 10000
      },
      "GBP": {
        "value": 8000
      }
    },
    "irr-cf3": {
      "label": "Year 3 Cash Flow",
      "kind": "amount",
      "INR": {
        "value": 50000
      },
      "USD": {
        "value": 12500
      },
      "EUR": {
        "value": 12500
      },
      "GBP": {
        "value": 10000
      }
    },
    "irr-cf4": {
      "label": "Year 4 Cash Flow",
      "kind": "amount",
      "INR": {
        "value": 60000
      },
      "USD": {
        "value": 15000
      },
      "EUR": {
        "value": 15000
      },
      "GBP": {
        "value": 12000
      }
    }
  },
  "liquidity-ratios": {
    "lr-cash": {
      "label": "Cash & Cash Equivalents",
      "kind": "amount",
      "INR": {
        "value": 300000
      },
      "USD": {
        "value": 40000
      },
      "EUR": {
        "value": 40000
      },
      "GBP": {
        "value": 30000
      }
    },
    "lr-securities": {
      "label": "Marketable Securities (Liquid Investments)",
      "kind": "amount",
      "INR": {
        "value": 100000
      },
      "USD": {
        "value": 15000
      },
      "EUR": {
        "value": 15000
      },
      "GBP": {
        "value": 12000
      }
    },
    "lr-receivables": {
      "label": "Accounts Receivable",
      "kind": "amount",
      "INR": {
        "value": 400000
      },
      "USD": {
        "value": 50000
      },
      "EUR": {
        "value": 50000
      },
      "GBP": {
        "value": 40000
      }
    },
    "lr-inventory": {
      "label": "Inventory",
      "kind": "amount",
      "INR": {
        "value": 450000
      },
      "USD": {
        "value": 55000
      },
      "EUR": {
        "value": 55000
      },
      "GBP": {
        "value": 45000
      }
    },
    "lr-liabilities": {
      "label": "Current Liabilities",
      "kind": "amount",
      "INR": {
        "value": 500000
      },
      "USD": {
        "value": 60000
      },
      "EUR": {
        "value": 60000
      },
      "GBP": {
        "value": 50000
      }
    }
  },
  "loan-affordability": {
    "afford-budget": {
      "label": "Maximum Monthly Payment Budget",
      "kind": "amount",
      "INR": {
        "value": 40000,
        "min": 5000,
        "max": 500000,
        "step": 1000
      },
      "USD": {
        "value": 2000,
        "min": 200,
        "max": 20000,
        "step": 100
      },
      "EUR": {
        "value": 1500,
        "min": 150,
        "max": 15000,
        "step": 100
      },
      "GBP": {
        "value": 1400,
        "min": 150,
        "max": 15000,
        "step": 100
      }
    },
    "afford-rate": {
      "label": "Expected Annual Interest Rate",
      "kind": "rate",
      "INR": {
        "value": 9,
        "min": 5,
        "max": 20,
        "step": 0.1
      },
      "USD": {
        "value": 6.5,
        "min": 2,
        "max": 16,
        "step": 0.1
      },
      "EUR": {
        "value": 4.5,
        "min": 1.5,
        "max": 14,
        "step": 0.1
      },
      "GBP": {
        "value": 5.5,
        "min": 2,
        "max": 15,
        "step": 0.1
      }
    }
  },
  "loan-amortization": {
    "amort-principal": {
      "label": "Loan Amount",
      "kind": "amount",
      "INR": {
        "value": 1000000,
        "min": 50000,
        "max": 10000000,
        "step": 25000
      },
      "USD": {
        "value": 30000,
        "min": 2000,
        "max": 250000,
        "step": 1000
      },
      "EUR": {
        "value": 30000,
        "min": 2000,
        "max": 250000,
        "step": 1000
      },
      "GBP": {
        "value": 25000,
        "min": 2000,
        "max": 200000,
        "step": 1000
      }
    },
    "amort-rate": {
      "label": "Annual Interest Rate",
      "kind": "rate",
      "INR": {
        "value": 9.5,
        "min": 5,
        "max": 20,
        "step": 0.1
      },
      "USD": {
        "value": 6.5,
        "min": 2,
        "max": 16,
        "step": 0.1
      },
      "EUR": {
        "value": 4.5,
        "min": 1.5,
        "max": 14,
        "step": 0.1
      },
      "GBP": {
        "value": 5.5,
        "min": 2,
        "max": 15,
        "step": 0.1
      }
    }
  },
  "loan-prepayment": {
    "lp-principal": {
      "label": "Initial Loan Amount",
      "kind": "amount",
      "INR": {
        "value": 3000000,
        "min": 100000,
        "max": 20000000,
        "step": 50000
      },
      "USD": {
        "value": 250000,
        "min": 10000,
        "max": 1000000,
        "step": 5000
      },
      "EUR": {
        "value": 200000,
        "min": 10000,
        "max": 800000,
        "step": 5000
      },
      "GBP": {
        "value": 180000,
        "min": 10000,
        "max": 750000,
        "step": 5000
      }
    },
    "lp-rate": {
      "label": "Annual Interest Rate",
      "kind": "rate",
      "INR": {
        "value": 8.5,
        "min": 5,
        "max": 18,
        "step": 0.1
      },
      "USD": {
        "value": 6.5,
        "min": 2,
        "max": 14,
        "step": 0.1
      },
      "EUR": {
        "value": 4.2,
        "min": 1,
        "max": 12,
        "step": 0.1
      },
      "GBP": {
        "value": 5.2,
        "min": 1,
        "max": 12,
        "step": 0.1
      }
    },
    "lp-prepay": {
      "label": "Lump-Sum Prepayment Amount",
      "kind": "amount",
      "INR": {
        "value": 300000,
        "min": 10000,
        "max": 5000000,
        "step": 10000
      },
      "USD": {
        "value": 20000,
        "min": 1000,
        "max": 100000,
        "step": 1000
      },
      "EUR": {
        "value": 15000,
        "min": 1000,
        "max": 80000,
        "step": 1000
      },
      "GBP": {
        "value": 15000,
        "min": 1000,
        "max": 75000,
        "step": 1000
      }
    }
  },
  "lump-sum": {
    "ls-principal": {
      "label": "Total Investment Amount",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 5000,
        "max": 10000000,
        "step": 5000
      },
      "USD": {
        "value": 10000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "EUR": {
        "value": 10000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "GBP": {
        "value": 10000,
        "min": 500,
        "max": 500000,
        "step": 500
      }
    },
    "ls-rate": {
      "label": "Expected Annual Return",
      "kind": "rate",
      "INR": {
        "value": 8,
        "min": 1,
        "max": 30,
        "step": 0.5
      },
      "USD": {
        "value": 7,
        "min": 1,
        "max": 20,
        "step": 0.25
      },
      "EUR": {
        "value": 6,
        "min": 1,
        "max": 20,
        "step": 0.25
      },
      "GBP": {
        "value": 6,
        "min": 1,
        "max": 20,
        "step": 0.25
      }
    }
  },
  "markup-vs-margin": {
    "mvm-cost": {
      "label": "Unit Cost (Cost of Goods)",
      "kind": "amount",
      "INR": {
        "value": 1000,
        "min": 1,
        "max": 100000,
        "step": 10
      },
      "USD": {
        "value": 100,
        "min": 1,
        "max": 10000,
        "step": 1
      },
      "EUR": {
        "value": 100,
        "min": 1,
        "max": 10000,
        "step": 1
      },
      "GBP": {
        "value": 80,
        "min": 1,
        "max": 8000,
        "step": 1
      }
    },
    "mvm-rate": {
      "label": "Percentage Rate",
      "kind": "rate",
      "INR": {
        "value": 25,
        "min": 1,
        "max": 99,
        "step": 0.5
      },
      "USD": {
        "value": 25,
        "min": 1,
        "max": 99,
        "step": 0.5
      },
      "EUR": {
        "value": 25,
        "min": 1,
        "max": 99,
        "step": 0.5
      },
      "GBP": {
        "value": 25,
        "min": 1,
        "max": 99,
        "step": 0.5
      }
    }
  },
  "mortgage": {
    "mort-price": {
      "label": "Home Purchase Price",
      "kind": "amount",
      "INR": {
        "value": 5000000,
        "min": 500000,
        "max": 50000000,
        "step": 50000
      },
      "USD": {
        "value": 400000,
        "min": 50000,
        "max": 2000000,
        "step": 5000
      },
      "EUR": {
        "value": 350000,
        "min": 50000,
        "max": 1500000,
        "step": 5000
      },
      "GBP": {
        "value": 300000,
        "min": 50000,
        "max": 1500000,
        "step": 5000
      }
    },
    "mort-down": {
      "label": "Down Payment (%)",
      "kind": "rate",
      "INR": {
        "value": 20,
        "min": 0,
        "max": 80,
        "step": 1
      },
      "USD": {
        "value": 20,
        "min": 0,
        "max": 80,
        "step": 1
      },
      "EUR": {
        "value": 20,
        "min": 0,
        "max": 80,
        "step": 1
      },
      "GBP": {
        "value": 20,
        "min": 0,
        "max": 80,
        "step": 1
      }
    },
    "mort-rate": {
      "label": "Annual Interest Rate",
      "kind": "rate",
      "INR": {
        "value": 8.5,
        "min": 2,
        "max": 15,
        "step": 0.05
      },
      "USD": {
        "value": 6.75,
        "min": 2,
        "max": 14,
        "step": 0.05
      },
      "EUR": {
        "value": 3.8,
        "min": 1,
        "max": 10,
        "step": 0.05
      },
      "GBP": {
        "value": 4.8,
        "min": 1,
        "max": 12,
        "step": 0.05
      }
    }
  },
  "npv": {
    "npv-discount": {
      "label": "Discount Rate (%)",
      "kind": "rate",
      "INR": {
        "value": 10,
        "min": 1,
        "max": 30,
        "step": 0.5
      },
      "USD": {
        "value": 8,
        "min": 1,
        "max": 25,
        "step": 0.25
      },
      "EUR": {
        "value": 7,
        "min": 1,
        "max": 20,
        "step": 0.25
      },
      "GBP": {
        "value": 7,
        "min": 1,
        "max": 20,
        "step": 0.25
      }
    },
    "npv-initial": {
      "label": "Initial Investment (Year 0 Outflow)",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 1000,
        "max": 10000000,
        "step": 5000
      },
      "USD": {
        "value": 25000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "EUR": {
        "value": 25000,
        "min": 500,
        "max": 500000,
        "step": 500
      },
      "GBP": {
        "value": 20000,
        "min": 500,
        "max": 400000,
        "step": 500
      }
    },
    "npv-cf1": {
      "label": "Year 1 Cash Flow",
      "kind": "amount",
      "INR": {
        "value": 30000
      },
      "USD": {
        "value": 7500
      },
      "EUR": {
        "value": 7500
      },
      "GBP": {
        "value": 6000
      }
    },
    "npv-cf2": {
      "label": "Year 2 Cash Flow",
      "kind": "amount",
      "INR": {
        "value": 40000
      },
      "USD": {
        "value": 10000
      },
      "EUR": {
        "value": 10000
      },
      "GBP": {
        "value": 8000
      }
    },
    "npv-cf3": {
      "label": "Year 3 Cash Flow",
      "kind": "amount",
      "INR": {
        "value": 50000
      },
      "USD": {
        "value": 12500
      },
      "EUR": {
        "value": 12500
      },
      "GBP": {
        "value": 10000
      }
    },
    "npv-cf4": {
      "label": "Year 4 Cash Flow",
      "kind": "amount",
      "INR": {
        "value": 60000
      },
      "USD": {
        "value": 15000
      },
      "EUR": {
        "value": 15000
      },
      "GBP": {
        "value": 12000
      }
    }
  },
  "payback-period": {
    "pb-initial": {
      "label": "Initial Investment Cost",
      "kind": "amount",
      "INR": {
        "value": 500000,
        "min": 1000,
        "max": 100000000,
        "step": 10000
      },
      "USD": {
        "value": 50000,
        "min": 500,
        "max": 5000000,
        "step": 1000
      },
      "EUR": {
        "value": 50000,
        "min": 500,
        "max": 5000000,
        "step": 1000
      },
      "GBP": {
        "value": 40000,
        "min": 500,
        "max": 4000000,
        "step": 1000
      }
    },
    "pb-annual": {
      "label": "Annual Cash Inflow (Even Mode)",
      "kind": "amount",
      "INR": {
        "value": 150000,
        "min": 100,
        "max": 50000000,
        "step": 5000
      },
      "USD": {
        "value": 15000,
        "min": 100,
        "max": 2000000,
        "step": 500
      },
      "EUR": {
        "value": 15000,
        "min": 100,
        "max": 2000000,
        "step": 500
      },
      "GBP": {
        "value": 12000,
        "min": 100,
        "max": 1500000,
        "step": 500
      }
    },
    "pb-y1": {
      "label": "Year 1 Inflow",
      "kind": "amount",
      "INR": {
        "value": 120000
      },
      "USD": {
        "value": 12000
      },
      "EUR": {
        "value": 12000
      },
      "GBP": {
        "value": 10000
      }
    },
    "pb-y2": {
      "label": "Year 2 Inflow",
      "kind": "amount",
      "INR": {
        "value": 150000
      },
      "USD": {
        "value": 15000
      },
      "EUR": {
        "value": 15000
      },
      "GBP": {
        "value": 12000
      }
    },
    "pb-y3": {
      "label": "Year 3 Inflow",
      "kind": "amount",
      "INR": {
        "value": 180000
      },
      "USD": {
        "value": 18000
      },
      "EUR": {
        "value": 18000
      },
      "GBP": {
        "value": 14000
      }
    },
    "pb-y4": {
      "label": "Year 4 Inflow",
      "kind": "amount",
      "INR": {
        "value": 200000
      },
      "USD": {
        "value": 20000
      },
      "EUR": {
        "value": 20000
      },
      "GBP": {
        "value": 16000
      }
    },
    "pb-y5": {
      "label": "Year 5 Inflow",
      "kind": "amount",
      "INR": {
        "value": 220000
      },
      "USD": {
        "value": 22000
      },
      "EUR": {
        "value": 22000
      },
      "GBP": {
        "value": 18000
      }
    }
  },
  "present-value": {
    "pv-future": {
      "label": "Future Value (Target Amount)",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 1000,
        "max": 10000000,
        "step": 5000
      },
      "USD": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 500
      },
      "EUR": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 500
      },
      "GBP": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 500
      }
    },
    "pv-rate": {
      "label": "Discount Rate per Period",
      "kind": "rate",
      "INR": {
        "value": 8,
        "min": 0.1,
        "max": 30,
        "step": 0.1
      },
      "USD": {
        "value": 7,
        "min": 0.1,
        "max": 20,
        "step": 0.1
      },
      "EUR": {
        "value": 6,
        "min": 0.1,
        "max": 20,
        "step": 0.1
      },
      "GBP": {
        "value": 6,
        "min": 0.1,
        "max": 20,
        "step": 0.1
      }
    }
  },
  "profit-margin": {
    "pm-revenue": {
      "label": "Net Sales / Revenue",
      "kind": "amount",
      "INR": {
        "value": 1000000,
        "min": 1000,
        "max": 100000000,
        "step": 25000
      },
      "USD": {
        "value": 150000,
        "min": 1000,
        "max": 5000000,
        "step": 2500
      },
      "EUR": {
        "value": 150000,
        "min": 1000,
        "max": 5000000,
        "step": 2500
      },
      "GBP": {
        "value": 120000,
        "min": 1000,
        "max": 4000000,
        "step": 2000
      }
    },
    "pm-cogs": {
      "label": "Cost of Goods Sold (COGS)",
      "kind": "amount",
      "INR": {
        "value": 600000,
        "min": 0,
        "max": 100000000,
        "step": 25000
      },
      "USD": {
        "value": 90000,
        "min": 0,
        "max": 5000000,
        "step": 2500
      },
      "EUR": {
        "value": 90000,
        "min": 0,
        "max": 5000000,
        "step": 2500
      },
      "GBP": {
        "value": 75000,
        "min": 0,
        "max": 4000000,
        "step": 2000
      }
    },
    "pm-opex": {
      "label": "Operating Expenses (SG&A, R&D)",
      "kind": "amount",
      "INR": {
        "value": 150000,
        "min": 0,
        "max": 50000000,
        "step": 10000
      },
      "USD": {
        "value": 25000,
        "min": 0,
        "max": 2000000,
        "step": 1000
      },
      "EUR": {
        "value": 25000,
        "min": 0,
        "max": 2000000,
        "step": 1000
      },
      "GBP": {
        "value": 20000,
        "min": 0,
        "max": 1500000,
        "step": 1000
      }
    },
    "pm-taxes": {
      "label": "Taxes & Interest Expenses",
      "kind": "amount",
      "INR": {
        "value": 50000,
        "min": 0,
        "max": 20000000,
        "step": 5000
      },
      "USD": {
        "value": 8000,
        "min": 0,
        "max": 1000000,
        "step": 500
      },
      "EUR": {
        "value": 8000,
        "min": 0,
        "max": 1000000,
        "step": 500
      },
      "GBP": {
        "value": 6000,
        "min": 0,
        "max": 800000,
        "step": 500
      }
    }
  },
  "rd": {
    "rd-monthly": {
      "label": "Monthly Deposit Amount",
      "kind": "amount",
      "INR": {
        "value": 5000,
        "min": 500,
        "max": 100000,
        "step": 500
      },
      "USD": {
        "value": 250,
        "min": 25,
        "max": 5000,
        "step": 25
      },
      "EUR": {
        "value": 200,
        "min": 25,
        "max": 4000,
        "step": 25
      },
      "GBP": {
        "value": 200,
        "min": 25,
        "max": 4000,
        "step": 25
      }
    },
    "rd-rate": {
      "label": "Interest Rate (% p.a.)",
      "kind": "rate",
      "INR": {
        "value": 7,
        "min": 3,
        "max": 12,
        "step": 0.1
      },
      "USD": {
        "value": 4.5,
        "min": 1,
        "max": 9,
        "step": 0.1
      },
      "EUR": {
        "value": 3,
        "min": 0.5,
        "max": 8,
        "step": 0.1
      },
      "GBP": {
        "value": 4.2,
        "min": 1,
        "max": 9,
        "step": 0.1
      }
    }
  },
  "roi": {
    "roi-initial": {
      "label": "Initial Amount Invested",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 1000,
        "max": 10000000,
        "step": 1000
      },
      "USD": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 500
      },
      "EUR": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 500
      },
      "GBP": {
        "value": 10000,
        "min": 100,
        "max": 500000,
        "step": 500
      }
    },
    "roi-final": {
      "label": "Final Value Returned",
      "kind": "amount",
      "INR": {
        "value": 250000,
        "min": 0,
        "max": 50000000,
        "step": 5000
      },
      "USD": {
        "value": 25000,
        "min": 0,
        "max": 1000000,
        "step": 1000
      },
      "EUR": {
        "value": 25000,
        "min": 0,
        "max": 1000000,
        "step": 1000
      },
      "GBP": {
        "value": 25000,
        "min": 0,
        "max": 1000000,
        "step": 1000
      }
    }
  },
  "savings-goal": {
    "sg-target": {
      "label": "Target Savings Goal",
      "kind": "amount",
      "INR": {
        "value": 2500000,
        "min": 50000,
        "max": 100000000,
        "step": 50000
      },
      "USD": {
        "value": 100000,
        "min": 5000,
        "max": 2000000,
        "step": 5000
      },
      "EUR": {
        "value": 100000,
        "min": 5000,
        "max": 2000000,
        "step": 5000
      },
      "GBP": {
        "value": 80000,
        "min": 5000,
        "max": 1500000,
        "step": 5000
      }
    },
    "sg-current": {
      "label": "Current Savings Already Accumulated",
      "kind": "amount",
      "INR": {
        "value": 200000,
        "min": 0,
        "max": 50000000,
        "step": 25000
      },
      "USD": {
        "value": 10000,
        "min": 0,
        "max": 1000000,
        "step": 2500
      },
      "EUR": {
        "value": 10000,
        "min": 0,
        "max": 1000000,
        "step": 2500
      },
      "GBP": {
        "value": 8000,
        "min": 0,
        "max": 750000,
        "step": 2000
      }
    },
    "sg-rate": {
      "label": "Expected Annual Return",
      "kind": "rate",
      "INR": {
        "value": 10,
        "min": 1,
        "max": 25,
        "step": 0.25
      },
      "USD": {
        "value": 7,
        "min": 1,
        "max": 18,
        "step": 0.25
      },
      "EUR": {
        "value": 6,
        "min": 1,
        "max": 18,
        "step": 0.25
      },
      "GBP": {
        "value": 6,
        "min": 1,
        "max": 18,
        "step": 0.25
      }
    }
  },
  "simple-interest": {
    "si-principal": {
      "label": "Principal Amount",
      "kind": "amount",
      "INR": {
        "value": 100000,
        "min": 1000,
        "max": 10000000,
        "step": 1000
      },
      "USD": {
        "value": 10000,
        "min": 100,
        "max": 250000,
        "step": 100
      },
      "EUR": {
        "value": 10000,
        "min": 100,
        "max": 250000,
        "step": 100
      },
      "GBP": {
        "value": 10000,
        "min": 100,
        "max": 250000,
        "step": 100
      }
    },
    "si-rate": {
      "label": "Annual Interest Rate",
      "kind": "rate",
      "INR": {
        "value": 7.5,
        "min": 1,
        "max": 25,
        "step": 0.25
      },
      "USD": {
        "value": 5,
        "min": 1,
        "max": 18,
        "step": 0.25
      },
      "EUR": {
        "value": 4,
        "min": 1,
        "max": 15,
        "step": 0.25
      },
      "GBP": {
        "value": 4.5,
        "min": 1,
        "max": 16,
        "step": 0.25
      }
    }
  },
  "sip": {
    "sip-monthly": {
      "label": "Monthly Investment",
      "kind": "amount",
      "INR": {
        "value": 25000,
        "min": 500,
        "max": 200000,
        "step": 500
      },
      "USD": {
        "value": 500,
        "min": 50,
        "max": 10000,
        "step": 50
      },
      "EUR": {
        "value": 400,
        "min": 50,
        "max": 10000,
        "step": 50
      },
      "GBP": {
        "value": 350,
        "min": 50,
        "max": 10000,
        "step": 50
      }
    },
    "sip-rate": {
      "label": "Expected Annual Return",
      "kind": "rate",
      "INR": {
        "value": 12,
        "min": 1,
        "max": 30,
        "step": 0.5
      },
      "USD": {
        "value": 8,
        "min": 1,
        "max": 20,
        "step": 0.25
      },
      "EUR": {
        "value": 7,
        "min": 1,
        "max": 20,
        "step": 0.25
      },
      "GBP": {
        "value": 7,
        "min": 1,
        "max": 20,
        "step": 0.25
      }
    }
  },
  "wacc": {
    "wacc-equity": {
      "label": "Market Value of Equity (E)",
      "kind": "amount",
      "INR": {
        "value": 7000000,
        "min": 100000,
        "max": 500000000,
        "step": 500000
      },
      "USD": {
        "value": 700000,
        "min": 10000,
        "max": 50000000,
        "step": 50000
      },
      "EUR": {
        "value": 700000,
        "min": 10000,
        "max": 50000000,
        "step": 50000
      },
      "GBP": {
        "value": 600000,
        "min": 10000,
        "max": 40000000,
        "step": 50000
      }
    },
    "wacc-debt": {
      "label": "Market Value of Debt (D)",
      "kind": "amount",
      "INR": {
        "value": 3000000,
        "min": 0,
        "max": 500000000,
        "step": 250000
      },
      "USD": {
        "value": 300000,
        "min": 0,
        "max": 50000000,
        "step": 25000
      },
      "EUR": {
        "value": 300000,
        "min": 0,
        "max": 50000000,
        "step": 25000
      },
      "GBP": {
        "value": 250000,
        "min": 0,
        "max": 40000000,
        "step": 25000
      }
    },
    "wacc-cost-equity": {
      "label": "Cost of Equity (Re)",
      "kind": "rate",
      "INR": {
        "value": 14.2,
        "min": 1,
        "max": 40,
        "step": 0.1
      },
      "USD": {
        "value": 10.5,
        "min": 1,
        "max": 30,
        "step": 0.1
      },
      "EUR": {
        "value": 9.5,
        "min": 1,
        "max": 30,
        "step": 0.1
      },
      "GBP": {
        "value": 9.8,
        "min": 1,
        "max": 30,
        "step": 0.1
      }
    },
    "wacc-cost-debt": {
      "label": "Pre-Tax Cost of Debt (Rd)",
      "kind": "rate",
      "INR": {
        "value": 8.5,
        "min": 0.5,
        "max": 30,
        "step": 0.1
      },
      "USD": {
        "value": 6,
        "min": 0.5,
        "max": 20,
        "step": 0.1
      },
      "EUR": {
        "value": 4.8,
        "min": 0.5,
        "max": 20,
        "step": 0.1
      },
      "GBP": {
        "value": 5.2,
        "min": 0.5,
        "max": 20,
        "step": 0.1
      }
    },
    "wacc-tax-rate": {
      "label": "Corporate Tax Rate (t)",
      "kind": "rate",
      "INR": {
        "value": 25,
        "min": 0,
        "max": 50,
        "step": 0.5
      },
      "USD": {
        "value": 21,
        "min": 0,
        "max": 50,
        "step": 0.5
      },
      "EUR": {
        "value": 25,
        "min": 0,
        "max": 50,
        "step": 0.5
      },
      "GBP": {
        "value": 25,
        "min": 0,
        "max": 50,
        "step": 0.5
      }
    }
  },
  "working-capital": {
    "wc-cash": {
      "label": "Cash & Cash Equivalents",
      "kind": "amount",
      "INR": {
        "value": 250000
      },
      "USD": {
        "value": 35000
      },
      "EUR": {
        "value": 35000
      },
      "GBP": {
        "value": 30000
      }
    },
    "wc-receivables": {
      "label": "Accounts Receivable",
      "kind": "amount",
      "INR": {
        "value": 350000
      },
      "USD": {
        "value": 50000
      },
      "EUR": {
        "value": 50000
      },
      "GBP": {
        "value": 40000
      }
    },
    "wc-inventory": {
      "label": "Inventory",
      "kind": "amount",
      "INR": {
        "value": 400000
      },
      "USD": {
        "value": 55000
      },
      "EUR": {
        "value": 55000
      },
      "GBP": {
        "value": 45000
      }
    },
    "wc-payables": {
      "label": "Accounts Payable",
      "kind": "amount",
      "INR": {
        "value": 300000
      },
      "USD": {
        "value": 45000
      },
      "EUR": {
        "value": 45000
      },
      "GBP": {
        "value": 35000
      }
    },
    "wc-debt": {
      "label": "Short-Term Debt & Current Liabilities",
      "kind": "amount",
      "INR": {
        "value": 150000
      },
      "USD": {
        "value": 20000
      },
      "EUR": {
        "value": 20000
      },
      "GBP": {
        "value": 15000
      }
    }
  }
} satisfies Record<string, CalculatorDefaults>;

export type CalculatorKey = keyof typeof MARKET_DEFAULTS;

export const MARKET_CHIPS = {
  "sip": {
    "monthly": {
      "INR": [
        {
          "val": 5000,
          "label": "₹5k"
        },
        {
          "val": 10000,
          "label": "₹10k"
        },
        {
          "val": 25000,
          "label": "₹25k"
        },
        {
          "val": 50000,
          "label": "₹50k"
        },
        {
          "val": 100000,
          "label": "₹1L"
        }
      ],
      "USD": [
        {
          "val": 100,
          "label": "$100"
        },
        {
          "val": 250,
          "label": "$250"
        },
        {
          "val": 500,
          "label": "$500"
        },
        {
          "val": 1000,
          "label": "$1k"
        },
        {
          "val": 2500,
          "label": "$2.5k"
        }
      ],
      "EUR": [
        {
          "val": 100,
          "label": "€100"
        },
        {
          "val": 250,
          "label": "€250"
        },
        {
          "val": 400,
          "label": "€400"
        },
        {
          "val": 800,
          "label": "€800"
        },
        {
          "val": 1500,
          "label": "€1.5k"
        }
      ],
      "GBP": [
        {
          "val": 100,
          "label": "£100"
        },
        {
          "val": 200,
          "label": "£200"
        },
        {
          "val": 350,
          "label": "£350"
        },
        {
          "val": 750,
          "label": "£750"
        },
        {
          "val": 1500,
          "label": "£1.5k"
        }
      ]
    },
    "rate": {
      "INR": [
        {
          "val": 10,
          "label": "10%"
        },
        {
          "val": 12,
          "label": "12% (Equity avg)"
        },
        {
          "val": 15,
          "label": "15% (Aggressive)"
        }
      ],
      "USD": [
        {
          "val": 7,
          "label": "7%"
        },
        {
          "val": 8,
          "label": "8% (S&P avg)"
        },
        {
          "val": 10,
          "label": "10% (Aggressive)"
        }
      ],
      "EUR": [
        {
          "val": 6,
          "label": "6%"
        },
        {
          "val": 7,
          "label": "7% (Equity avg)"
        },
        {
          "val": 9,
          "label": "9% (Aggressive)"
        }
      ],
      "GBP": [
        {
          "val": 6,
          "label": "6%"
        },
        {
          "val": 7,
          "label": "7% (Equity avg)"
        },
        {
          "val": 9,
          "label": "9% (Aggressive)"
        }
      ]
    }
  },
  "emi": {
    "principal": {
      "INR": [
        {
          "val": 200000,
          "label": "₹2L"
        },
        {
          "val": 500000,
          "label": "₹5L"
        },
        {
          "val": 1000000,
          "label": "₹10L"
        },
        {
          "val": 2500000,
          "label": "₹25L"
        },
        {
          "val": 5000000,
          "label": "₹50L"
        }
      ],
      "USD": [
        {
          "val": 5000,
          "label": "$5k"
        },
        {
          "val": 15000,
          "label": "$15k"
        },
        {
          "val": 25000,
          "label": "$25k"
        },
        {
          "val": 50000,
          "label": "$50k"
        },
        {
          "val": 100000,
          "label": "$100k"
        }
      ],
      "EUR": [
        {
          "val": 5000,
          "label": "€5k"
        },
        {
          "val": 15000,
          "label": "€15k"
        },
        {
          "val": 25000,
          "label": "€25k"
        },
        {
          "val": 50000,
          "label": "€50k"
        },
        {
          "val": 100000,
          "label": "€100k"
        }
      ],
      "GBP": [
        {
          "val": 5000,
          "label": "£5k"
        },
        {
          "val": 10000,
          "label": "£10k"
        },
        {
          "val": 20000,
          "label": "£20k"
        },
        {
          "val": 40000,
          "label": "£40k"
        },
        {
          "val": 75000,
          "label": "£75k"
        }
      ]
    },
    "rate": {
      "INR": [
        {
          "val": 8.5,
          "label": "8.5% (Home avg)"
        },
        {
          "val": 9.5,
          "label": "9.5% (Auto avg)"
        },
        {
          "val": 11,
          "label": "11% (Personal)"
        }
      ],
      "USD": [
        {
          "val": 5.5,
          "label": "5.5%"
        },
        {
          "val": 6.5,
          "label": "6.5% (Avg)"
        },
        {
          "val": 7.5,
          "label": "7.5%"
        }
      ],
      "EUR": [
        {
          "val": 3.5,
          "label": "3.5%"
        },
        {
          "val": 4.5,
          "label": "4.5% (Avg)"
        },
        {
          "val": 5.5,
          "label": "5.5%"
        }
      ],
      "GBP": [
        {
          "val": 4.5,
          "label": "4.5%"
        },
        {
          "val": 5.5,
          "label": "5.5% (Avg)"
        },
        {
          "val": 6.5,
          "label": "6.5%"
        }
      ]
    }
  },
  "fd": {
    "principal": {
      "INR": [
        {
          "val": 50000,
          "label": "₹50k"
        },
        {
          "val": 100000,
          "label": "₹1L"
        },
        {
          "val": 200000,
          "label": "₹2L"
        },
        {
          "val": 500000,
          "label": "₹5L"
        },
        {
          "val": 1000000,
          "label": "₹10L"
        }
      ],
      "USD": [
        {
          "val": 2500,
          "label": "$2.5k"
        },
        {
          "val": 5000,
          "label": "$5k"
        },
        {
          "val": 10000,
          "label": "$10k"
        },
        {
          "val": 25000,
          "label": "$25k"
        },
        {
          "val": 50000,
          "label": "$50k"
        }
      ],
      "EUR": [
        {
          "val": 2500,
          "label": "€2.5k"
        },
        {
          "val": 5000,
          "label": "€5k"
        },
        {
          "val": 10000,
          "label": "€10k"
        },
        {
          "val": 25000,
          "label": "€25k"
        },
        {
          "val": 50000,
          "label": "€50k"
        }
      ],
      "GBP": [
        {
          "val": 2500,
          "label": "£2.5k"
        },
        {
          "val": 5000,
          "label": "£5k"
        },
        {
          "val": 10000,
          "label": "£10k"
        },
        {
          "val": 20000,
          "label": "£20k"
        },
        {
          "val": 50000,
          "label": "£50k"
        }
      ]
    },
    "rate": {
      "INR": [
        {
          "val": 6.5,
          "label": "6.5%"
        },
        {
          "val": 7.1,
          "label": "7.1% (RBI base)"
        },
        {
          "val": 7.5,
          "label": "7.5% (Sr Citizen)"
        }
      ],
      "USD": [
        {
          "val": 3.5,
          "label": "3.5%"
        },
        {
          "val": 4.5,
          "label": "4.5% (CD avg)"
        },
        {
          "val": 5.2,
          "label": "5.2% (High-yield)"
        }
      ],
      "EUR": [
        {
          "val": 2.5,
          "label": "2.5%"
        },
        {
          "val": 3,
          "label": "3.0% (Term avg)"
        },
        {
          "val": 3.8,
          "label": "3.8% (High-yield)"
        }
      ],
      "GBP": [
        {
          "val": 3.5,
          "label": "3.5%"
        },
        {
          "val": 4.2,
          "label": "4.2% (Fixed avg)"
        },
        {
          "val": 4.8,
          "label": "4.8% (Top rate)"
        }
      ]
    }
  }
} as const;

/**
 * Normalizes a slug or calculator identifier to match MARKET_DEFAULTS keys.
 * Examples: 'sip-calculator' -> 'sip', '/in/sip-calculator' -> 'sip', 'home_loan' -> 'home-loan'
 */
export function normalizeCalculatorKey(key: string): string {
  if (!key) return '';
  const clean = key.split('?')[0].split('#')[0].replace(/\/+$/, '');
  const segment = clean.split('/').pop() || '';
  const noExt = segment.replace(/\.html$/, '');
  const stripped = noExt.replace(/-calculator$/, '');
  return stripped.replace(/_/g, '-');
}

/**
 * Returns the defaults for one field in the given market,
 * falling back to INR when that market has no override.
 */
export function getFieldDefaults(
  calculator: string,
  fieldId: string,
  currency: CurrencyCode
): FieldDefaults | undefined {
  const normKey = normalizeCalculatorKey(calculator);
  const calc = (MARKET_DEFAULTS as Record<string, CalculatorDefaults>)[normKey];
  const field = calc?.[fieldId];
  if (!field) return undefined;
  return field[currency] ?? field.INR;
}

/**
 * Returns { fieldId: FieldDefaults } for every field of a calculator in the given market.
 */
export function getCalculatorDefaults(
  calculator: string,
  currency: CurrencyCode
): Record<string, FieldDefaults> {
  const normKey = normalizeCalculatorKey(calculator);
  const calc = (MARKET_DEFAULTS as Record<string, CalculatorDefaults>)[normKey];
  if (!calc) return {};
  const out: Record<string, FieldDefaults> = {};
  for (const [id, field] of Object.entries(calc)) {
    out[id] = field[currency] ?? field.INR;
  }
  return out;
}

/**
 * Returns preset chips for a calculator in a given market if configured.
 */
export function getCalculatorChips(
  calculator: string,
  currency: CurrencyCode
): Record<string, PresetChip[]> | undefined {
  const normKey = normalizeCalculatorKey(calculator);
  const chipsConfig = (MARKET_CHIPS as Record<string, Record<string, Record<string, PresetChip[]>>>)[normKey];
  if (!chipsConfig) return undefined;
  const out: Record<string, PresetChip[]> = {};
  for (const [chipKey, marketMap] of Object.entries(chipsConfig)) {
    out[chipKey] = marketMap[currency] ?? marketMap.INR;
  }
  return out;
}
