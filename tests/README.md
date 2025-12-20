# MBTI Senpai Test Suite

This directory contains all test files for the MBTI Senpai project, organized by category.

## 📁 Directory Structure

```
tests/
├── README.md (this file)
├── validation/          # Core validation tests
│   ├── test-100-cases.js
│   ├── test-all-personalities.js
│   ├── test-personality-validation.js
│   └── test-intended-answers.js
├── mode/                # Mode-specific tests
│   └── test-comprehensive-mode.js
└── analysis/            # Analysis and debugging tests
    ├── test-random-quizzes.js
    ├── test-quiz-analysis.js
    └── test-scoring-fix.js
```

## 🧪 Test Categories

### Validation Tests (`validation/`)

Core validation tests that verify the correctness of the scoring algorithm and question selection.

- **test-100-cases.js** - Comprehensive test suite with 100 test cases covering all 16 types, random answers, edge cases, and incomplete quizzes
- **test-all-personalities.js** - Tests all 16 MBTI personality types with 10 cases each (160 total)
- **test-personality-validation.js** - Comprehensive test suite for MBTI personality validation (96 test cases, 6 variations per type)
- **test-intended-answers.js** - Generates intended answers for each MBTI type and verifies scoring produces expected results

### Mode Tests (`mode/`)

Tests specific to different quiz modes (fast vs comprehensive).

- **test-comprehensive-mode.js** - Tests comprehensive mode (88 questions) with 160 test cases, validates question selection and scoring

### Analysis Tests (`analysis/`)

Analysis, debugging, and exploratory tests.

- **test-random-quizzes.js** - Tests 100 random quiz queries via actual API endpoint
- **test-quiz-analysis.js** - Comprehensive analysis script for MBTI quiz assessment issues
- **test-scoring-fix.js** - Verifies the fixed scoring system after corrections

## 🚀 Running Tests

### Run All Validation Tests

```bash
# From project root
node tests/validation/test-100-cases.js
node tests/validation/test-all-personalities.js
node tests/validation/test-personality-validation.js
node tests/validation/test-intended-answers.js
```

### Run Mode Tests

```bash
node tests/mode/test-comprehensive-mode.js
```

### Run Analysis Tests

```bash
node tests/analysis/test-random-quizzes.js
node tests/analysis/test-quiz-analysis.js
node tests/analysis/test-scoring-fix.js
```

## 📊 Test Results

Test results and documentation are available in [`docs/testing/`](../docs/testing/):

- [TEST-100-CASES-RESULTS.md](../docs/testing/TEST-100-CASES-RESULTS.md)
- [PERSONALITY-VALIDATION-TEST-RESULTS.md](../docs/testing/PERSONALITY-VALIDATION-TEST-RESULTS.md)

## 📝 Test File Descriptions

### Validation Tests

#### test-100-cases.js

- **Purpose:** Comprehensive validation with 100 test cases
- **Coverage:** All 16 types (64 tests), random answers (16), edge cases (5), incomplete quizzes (10), strong preferences (5)
- **Status:** ✅ 100% pass rate

#### test-all-personalities.js

- **Purpose:** Validate all 16 personality types
- **Coverage:** 10 test cases per type (160 total)
- **Focus:** Type accuracy validation

#### test-personality-validation.js

- **Purpose:** Comprehensive personality validation
- **Coverage:** 6 variations per type (96 total)
- **Focus:** Multiple answer patterns per type

#### test-intended-answers.js

- **Purpose:** Verify intended answers produce expected types
- **Coverage:** All 16 types with intended answer patterns
- **Focus:** Answer pattern validation

### Mode Tests

#### test-comprehensive-mode.js

- **Purpose:** Validate comprehensive mode (88 questions)
- **Coverage:** 160 test cases (128 type variations, 16 random, 6 edge cases, 10 incomplete)
- **Focus:** Question selection (22 per dichotomy) and scoring with 88 questions
- **Status:** ✅ 86-90% pass rate (failures in weak variations are expected)

### Analysis Tests

#### test-random-quizzes.js

- **Purpose:** Test actual API endpoint with random answers
- **Coverage:** 100 random quiz queries
- **Focus:** API integration and real-world scenarios

#### test-quiz-analysis.js

- **Purpose:** Analyze quiz assessment issues
- **Focus:** Debugging and issue identification

#### test-scoring-fix.js

- **Purpose:** Verify scoring system fixes
- **Focus:** Post-fix validation

## 🔧 Test Requirements

All tests require:

- Node.js or Bun runtime
- Access to `src/mbti/mbti-questions-by-dichotomy.json`
- Some tests require API server to be running (test-random-quizzes.js)

## 📚 Related Documentation

- [Quiz Generation & Scoring Review](../docs/reviews/QUIZ-GENERATION-SCORING-REVIEW.md)
- [Scoring Analysis](../docs/reviews/SCORING-ANALYSIS.md)
- [Test Results](../docs/testing/)

---

**Last Updated:** January 2025
