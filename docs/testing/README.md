# Testing Documentation

This directory contains test results and validation documentation for the MBTI Senpai project.

## 📊 Test Results

- **[TEST-100-CASES-RESULTS.md](./TEST-100-CASES-RESULTS.md)** - Results from 100 comprehensive test cases (100% pass rate)
- **[PERSONALITY-VALIDATION-TEST-RESULTS.md](./PERSONALITY-VALIDATION-TEST-RESULTS.md)** - Results from personality type validation tests

## 🧪 Running Tests

All test files are located in the [`tests/`](../../tests/) directory. See [tests/README.md](../../tests/README.md) for detailed information about each test.

### Quick Start

```bash
# Run comprehensive validation (100 test cases)
npm run test:validation

# Run all personality types validation
npm run test:all-personalities

# Run personality validation suite
npm run test:personality

# Run comprehensive mode tests (88 questions)
npm run test:comprehensive

# Run random quiz tests
npm run test:random
```

Or run directly:

```bash
node tests/validation/test-100-cases.js
node tests/mode/test-comprehensive-mode.js
```

## 📁 Test Organization

Tests are organized into three categories:

1. **Validation Tests** (`tests/validation/`) - Core validation of scoring and question selection
2. **Mode Tests** (`tests/mode/`) - Tests specific to fast/comprehensive modes
3. **Analysis Tests** (`tests/analysis/`) - Analysis, debugging, and exploratory tests

See [tests/README.md](../../tests/README.md) for complete documentation.

---

**Last Updated:** January 2025
