# Test Files Organization

**Date:** January 2025  
**Action:** Organized all test files into a structured `tests/` directory

---

## 📁 New Structure

All test files have been organized into the following structure:

```
tests/
├── README.md                    # Test documentation (start here!)
├── validation/                  # Core validation tests
│   ├── test-100-cases.js
│   ├── test-all-personalities.js
│   ├── test-personality-validation.js
│   └── test-intended-answers.js
├── mode/                        # Mode-specific tests
│   └── test-comprehensive-mode.js
└── analysis/                    # Analysis and debugging tests
    ├── test-random-quizzes.js
    ├── test-quiz-analysis.js
    └── test-scoring-fix.js
```

---

## 📝 Files Moved

### From Root Directory

- `test-100-cases.js` → `tests/validation/`
- `test-all-personalities.js` → `tests/validation/`
- `test-personality-validation.js` → `tests/validation/`
- `test-intended-answers.js` → `tests/validation/`
- `test-comprehensive-mode.js` → `tests/mode/`
- `test-random-quizzes.js` → `tests/analysis/`
- `test-quiz-analysis.js` → `tests/analysis/`
- `test-scoring-fix.js` → `tests/analysis/`

---

## 🔧 Changes Made

### 1. Path Updates

All test files have been updated to use correct relative paths:

- **Before:** `require("./src/mbti/...")` or `join(__dirname, "src/mbti/...")`
- **After:** `require("../../src/mbti/...")` or `join(__dirname, "../../src/mbti/...")`

### 2. Documentation

- Created `tests/README.md` with comprehensive test documentation
- Created `docs/testing/README.md` with testing quick start guide
- Updated main `README.md` with new test paths
- Updated `docs/README.md` to reference tests directory

### 3. Package.json Scripts

Added npm scripts for easy test execution:

```json
{
  "test:validation": "node tests/validation/test-100-cases.js",
  "test:all-personalities": "node tests/validation/test-all-personalities.js",
  "test:personality": "node tests/validation/test-personality-validation.js",
  "test:comprehensive": "node tests/mode/test-comprehensive-mode.js",
  "test:random": "node tests/analysis/test-random-quizzes.js"
}
```

---

## ✅ Verification

All tests have been verified to work correctly after the move:

- ✅ `tests/validation/test-100-cases.js` - Runs successfully
- ✅ `tests/mode/test-comprehensive-mode.js` - Runs successfully
- ✅ All file paths updated correctly
- ✅ No broken references

---

## 🚀 Usage

### Run Tests via npm

```bash
npm run test:validation
npm run test:comprehensive
npm run test:personality
```

### Run Tests Directly

```bash
node tests/validation/test-100-cases.js
node tests/mode/test-comprehensive-mode.js
node tests/validation/test-personality-validation.js
```

---

## 📚 Related Documentation

- [tests/README.md](../../tests/README.md) - Complete test documentation
- [docs/testing/README.md](./README.md) - Testing quick start guide
- [Quiz Generation & Scoring Review](../reviews/QUIZ-GENERATION-SCORING-REVIEW.md)

---

**Last Updated:** January 2025
