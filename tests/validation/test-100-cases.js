#!/usr/bin/env node

/**
 * Comprehensive Test Suite - 100 Test Cases
 * Tests quiz scoring algorithm with various answer patterns
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const questionsByDichotomy = JSON.parse(
  readFileSync(
    `${__dirname}/../../src/mbti/mbti-questions-by-dichotomy.json`,
    "utf-8"
  )
);

const DICHOTOMY_LETTERS = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

const QUESTIONS_PER_DICHOTOMY = 11;
const EXPECTED_QUESTIONS_COUNT = 44;

// Build question index (same as API)
const QUESTION_INDEX = new Map();

for (const [dichotomyKey, list] of Object.entries(questionsByDichotomy)) {
  for (const q of list) {
    if (!QUESTION_INDEX.has(q.id)) {
      QUESTION_INDEX.set(q.id, {
        id: q.id,
        dichotomy: dichotomyKey,
        weights: q.weights || {
          E: 0,
          I: 0,
          S: 0,
          N: 0,
          T: 0,
          F: 0,
          J: 0,
          P: 0,
        },
      });
    }
  }
}

// Get selected questions (same as API with seeded shuffle)
function seededShuffle(items, seed) {
  const array = [...items];
  let currentSeed = seed;
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRotationSeed() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return dayOfYear;
}

function getSelectedQuestions() {
  const rotationSeed = getRotationSeed();
  const allQuestions = [];

  Object.keys(DICHOTOMY_LETTERS).forEach((dichotomyKey) => {
    const raw = questionsByDichotomy[dichotomyKey];
    if (!raw || raw.length < QUESTIONS_PER_DICHOTOMY) {
      throw new Error(`Not enough questions for ${dichotomyKey}`);
    }

    const dichotomySeed =
      rotationSeed +
      dichotomyKey.charCodeAt(0) * 1000 +
      dichotomyKey.charCodeAt(1) * 100;
    const selected = seededShuffle(raw, dichotomySeed).slice(
      0,
      QUESTIONS_PER_DICHOTOMY
    );
    allQuestions.push(...selected);
  });

  const finalSeed = rotationSeed * 1000;
  return seededShuffle(allQuestions, finalSeed);
}

// Scoring logic (same as API)
function emptyScores() {
  return { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
}

function computeType(scores) {
  const ei = scores.E >= scores.I ? "E" : "I";
  const sn = scores.S >= scores.N ? "S" : "N";
  const tf = scores.T >= scores.F ? "T" : "F";
  const jp = scores.J >= scores.P ? "J" : "P";
  return `${ei}${sn}${tf}${jp}`;
}

function scoreAnswers(answers) {
  const scores = emptyScores();
  let validCount = 0;
  let neutralCount = 0;
  const processedQuestionIds = new Set();

  // Validate and process answers (same as API)
  for (const answer of answers) {
    if (
      !answer ||
      typeof answer.questionId !== "number" ||
      typeof answer.value !== "number" ||
      ![-2, -1, 0, 1, 2].includes(answer.value)
    ) {
      continue;
    }

    if (processedQuestionIds.has(answer.questionId)) {
      continue; // Skip duplicates
    }

    const meta = QUESTION_INDEX.get(answer.questionId);
    if (!meta) continue;

    processedQuestionIds.add(answer.questionId);

    const answerValue = answer.value;
    if (answerValue === 0) {
      neutralCount++;
      validCount++; // Still counts as valid answer
      continue;
    }

    validCount++;
    for (const [letter, weight] of Object.entries(meta.weights)) {
      if (weight !== 0) {
        scores[letter] += answerValue * weight;
      }
    }
  }

  // Check for all neutral or no valid answers (same as API)
  if (validCount === 0) {
    return {
      type: "XXXX",
      scores: emptyScores(),
      percentages: { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 },
      validCount: 0,
      neutralCount: 0,
      warning: "No valid answers provided",
    };
  }

  if (validCount === neutralCount) {
    // All neutral answers - return XXXX (same as API)
    return {
      type: "XXXX",
      scores: emptyScores(),
      percentages: { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 },
      validCount,
      neutralCount,
      warning: "All answers were neutral",
    };
  }

  // Calculate percentages
  const percentages = { ...scores };
  const pairs = [
    ["E", "I"],
    ["S", "N"],
    ["T", "F"],
    ["J", "P"],
  ];

  for (const [a, b] of pairs) {
    const minScore = Math.min(scores[a], scores[b]);
    const normalizedA = scores[a] - minScore;
    const normalizedB = scores[b] - minScore;
    const total = normalizedA + normalizedB;

    if (total === 0) {
      percentages[a] = 50;
      percentages[b] = 50;
    } else {
      percentages[a] = Math.round((normalizedA / total) * 100);
      percentages[b] = 100 - percentages[a];
    }
  }

  const type = computeType(scores);
  const warning =
    validCount < EXPECTED_QUESTIONS_COUNT
      ? `Only ${validCount} out of ${EXPECTED_QUESTIONS_COUNT} questions answered`
      : undefined;

  return {
    type,
    scores,
    percentages,
    validCount,
    neutralCount,
    warning,
  };
}

// Test case generators
function generateAnswersForType(type, questions, variation) {
  const letters = {
    first: type[0], // E/I
    second: type[1], // S/N
    third: type[2], // T/F
    fourth: type[3], // J/P
  };

  const answers = [];

  for (const question of questions) {
    const weights = QUESTION_INDEX.get(question.id)?.weights || {};
    let alignmentScore = 0;

    // Calculate alignment with target type
    for (const [letter, weight] of Object.entries(weights)) {
      if (weight === 0) continue;

      let weightMultiplier = 1.0;
      if (
        letter === letters.first ||
        letter === (letters.first === "E" ? "I" : "E")
      ) {
        weightMultiplier = 1.3;
      } else if (
        letter === letters.second ||
        letter === (letters.second === "S" ? "N" : "S")
      ) {
        weightMultiplier = 1.3;
      } else if (
        letter === letters.third ||
        letter === (letters.third === "T" ? "F" : "T")
      ) {
        weightMultiplier = 1.3;
      } else if (
        letter === letters.fourth ||
        letter === (letters.fourth === "J" ? "P" : "J")
      ) {
        weightMultiplier = 1.8;
      }

      if (
        letter === letters.first ||
        letter === letters.second ||
        letter === letters.third ||
        letter === letters.fourth
      ) {
        alignmentScore += weight * weightMultiplier;
      } else {
        alignmentScore -= weight * weightMultiplier;
      }
    }

    let answerValue = 0;

    if (alignmentScore > 0.1) {
      // Right option aligns
      switch (variation) {
        case 1:
          answerValue = 2;
          break;
        case 2:
          answerValue = 1;
          break;
        case 3:
          answerValue = Math.random() > 0.4 ? 2 : 1;
          break;
        case 4:
          answerValue =
            Math.random() > 0.25 ? (Math.random() > 0.5 ? 2 : 1) : 0;
          break;
        case 5:
          answerValue = Math.random() > 0.35 ? 1 : Math.random() > 0.6 ? 2 : 0;
          break;
        case 6:
          answerValue = Math.random() > 0.4 ? 1 : Math.random() > 0.5 ? 2 : -1;
          break;
      }
    } else if (alignmentScore < -0.1) {
      // Left option aligns
      switch (variation) {
        case 1:
          answerValue = -2;
          break;
        case 2:
          answerValue = -1;
          break;
        case 3:
          answerValue = Math.random() > 0.4 ? -2 : -1;
          break;
        case 4:
          answerValue =
            Math.random() > 0.25 ? (Math.random() > 0.5 ? -2 : -1) : 0;
          break;
        case 5:
          answerValue =
            Math.random() > 0.35 ? -1 : Math.random() > 0.6 ? -2 : 0;
          break;
        case 6:
          answerValue = Math.random() > 0.4 ? -1 : Math.random() > 0.5 ? -2 : 1;
          break;
      }
    } else {
      // Neutral
      switch (variation) {
        case 1:
        case 2:
        case 3:
          answerValue = alignmentScore > 0 ? 1 : -1;
          break;
        case 4:
          answerValue = Math.random() > 0.4 ? 0 : alignmentScore > 0 ? 1 : -1;
          break;
        case 5:
        case 6:
          answerValue = 0;
          break;
      }
    }

    answers.push({
      questionId: question.id,
      value: answerValue,
    });
  }

  return answers;
}

function generateRandomAnswers(questions) {
  const answers = [];
  for (const question of questions) {
    const value = [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
    answers.push({
      questionId: question.id,
      value: value,
    });
  }
  return answers;
}

function generateAllNeutralAnswers(questions) {
  return questions.map((q) => ({
    questionId: q.id,
    value: 0,
  }));
}

function generateIncompleteAnswers(questions, count) {
  const answers = [];
  const selected = questions.slice(0, count);
  for (const question of selected) {
    const value = [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
    answers.push({
      questionId: question.id,
      value: value,
    });
  }
  return answers;
}

// Test execution
function runTests() {
  console.log("=".repeat(80));
  console.log("MBTI Quiz Algorithm - 100 Test Cases");
  console.log("=".repeat(80));
  console.log();

  const allQuestions = getSelectedQuestions();
  const testCases = [];
  let testId = 1;

  // Test 1-64: All 16 types × 4 variations each
  const types = [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
  ];

  for (const type of types) {
    for (let variation = 1; variation <= 4; variation++) {
      const answers = generateAnswersForType(type, allQuestions, variation);
      const result = scoreAnswers(answers);
      testCases.push({
        id: testId++,
        name: `${type} - Variation ${variation}`,
        expectedType: type,
        answers,
        result,
        category: "Type Validation",
      });
    }
  }

  // Test 65-80: Random valid answers (16 cases)
  for (let i = 0; i < 16; i++) {
    const answers = generateRandomAnswers(allQuestions);
    const result = scoreAnswers(answers);
    testCases.push({
      id: testId++,
      name: `Random Answers ${i + 1}`,
      expectedType: null, // No expectation
      answers,
      result,
      category: "Random",
    });
  }

  // Test 81-85: Edge cases - All neutral
  for (let i = 0; i < 5; i++) {
    const answers = generateAllNeutralAnswers(allQuestions);
    const result = scoreAnswers(answers);
    testCases.push({
      id: testId++,
      name: `All Neutral ${i + 1}`,
      expectedType: "XXXX",
      answers,
      result,
      category: "Edge Case",
    });
  }

  // Test 86-95: Incomplete quizzes (10 cases)
  for (let i = 0; i < 10; i++) {
    const count = Math.floor(Math.random() * 20) + 20; // 20-39 questions
    const answers = generateIncompleteAnswers(allQuestions, count);
    const result = scoreAnswers(answers);
    testCases.push({
      id: testId++,
      name: `Incomplete Quiz (${count} questions)`,
      expectedType: null,
      answers,
      result,
      category: "Incomplete",
    });
  }

  // Test 96-100: Strong preference patterns (5 cases)
  const strongTypes = ["ENTJ", "INTJ", "ENFP", "ISFJ", "ESTP"];
  for (const type of strongTypes) {
    const answers = generateAnswersForType(type, allQuestions, 1); // Strong variation
    const result = scoreAnswers(answers);
    testCases.push({
      id: testId++,
      name: `${type} - Strong Preference`,
      expectedType: type,
      answers,
      result,
      category: "Strong Preference",
    });
  }

  // Validate and report
  console.log(`Generated ${testCases.length} test cases\n`);

  let passed = 0;
  let failed = 0;
  let warnings = 0;
  const failures = [];
  const warningsList = [];

  for (const testCase of testCases) {
    const { result, expectedType, name, category } = testCase;
    let isValid = true;
    let issues = [];

    // Validation checks
    if (expectedType !== null) {
      if (result.type !== expectedType) {
        isValid = false;
        issues.push(`Expected ${expectedType}, got ${result.type}`);
      }
    }

    // Check for XXXX type
    if (result.type === "XXXX") {
      if (
        result.validCount === 0 ||
        result.neutralCount === result.validCount
      ) {
        // Valid - all neutral
      } else {
        issues.push("XXXX type but has valid answers");
        isValid = false;
      }
    }

    // Check percentages sum to 100
    const pairs = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"],
    ];
    for (const [a, b] of pairs) {
      const sum = result.percentages[a] + result.percentages[b];
      if (sum !== 100) {
        issues.push(`${a}/${b} percentages sum to ${sum}, not 100`);
        isValid = false;
      }
    }

    // Check warning for incomplete
    if (result.validCount < EXPECTED_QUESTIONS_COUNT && !result.warning) {
      issues.push("Incomplete quiz but no warning");
      isValid = false;
    }

    if (result.warning) {
      warnings++;
      warningsList.push({ test: name, warning: result.warning });
    }

    if (isValid) {
      passed++;
    } else {
      failed++;
      failures.push({
        test: name,
        category,
        issues,
        result: result.type,
        expected: expectedType,
        validCount: result.validCount,
        neutralCount: result.neutralCount,
      });
    }
  }

  // Print results
  console.log("=".repeat(80));
  console.log("TEST RESULTS");
  console.log("=".repeat(80));
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`Pass Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  console.log();

  // Show sample results
  if (passed > 0) {
    console.log("=".repeat(80));
    console.log("SAMPLE TEST RESULTS");
    console.log("=".repeat(80));

    // Show examples from each category
    const categories = {};
    for (const testCase of testCases) {
      if (!categories[testCase.category]) {
        categories[testCase.category] = [];
      }
      if (categories[testCase.category].length < 3) {
        categories[testCase.category].push(testCase);
      }
    }

    for (const [category, examples] of Object.entries(categories)) {
      console.log(`\n${category}:`);
      for (const example of examples.slice(0, 2)) {
        const { result, name, expectedType } = example;
        console.log(`  ${name}`);
        console.log(
          `    Type: ${result.type}${
            expectedType ? ` (expected: ${expectedType})` : ""
          }`
        );
        console.log(
          `    Valid Answers: ${result.validCount}, Neutral: ${result.neutralCount}`
        );
        console.log(
          `    Percentages: E:${result.percentages.E}% I:${result.percentages.I}% S:${result.percentages.S}% N:${result.percentages.N}% T:${result.percentages.T}% F:${result.percentages.F}% J:${result.percentages.J}% P:${result.percentages.P}%`
        );
        if (result.warning) {
          console.log(`    ⚠️  ${result.warning}`);
        }
      }
    }
    console.log();
  }

  if (warnings > 0) {
    console.log("=".repeat(80));
    console.log("WARNINGS (Expected for incomplete quizzes)");
    console.log("=".repeat(80));
    warningsList.slice(0, 10).forEach((w) => {
      console.log(`  ${w.test}: ${w.warning}`);
    });
    if (warningsList.length > 10) {
      console.log(`  ... and ${warningsList.length - 10} more`);
    }
    console.log();
  }

  if (failed > 0) {
    console.log("=".repeat(80));
    console.log("FAILURES");
    console.log("=".repeat(80));
    failures.forEach((f) => {
      console.log(`\n❌ Test ${f.test} (${f.category})`);
      console.log(`   Expected: ${f.expected || "N/A"}`);
      console.log(`   Got: ${f.result}`);
      console.log(
        `   Valid Answers: ${f.validCount}, Neutral: ${f.neutralCount}`
      );
      f.issues.forEach((issue) => {
        console.log(`   - ${issue}`);
      });
    });
  } else {
    console.log("=".repeat(80));
    console.log("✅ ALL TESTS PASSED!");
    console.log("=".repeat(80));
  }

  // Summary by category
  console.log("\n" + "=".repeat(80));
  console.log("SUMMARY BY CATEGORY");
  console.log("=".repeat(80));

  const categoryStats = {};
  for (const testCase of testCases) {
    const cat = testCase.category;
    if (!categoryStats[cat]) {
      categoryStats[cat] = { total: 0, passed: 0, failed: 0 };
    }
    categoryStats[cat].total++;
    const isValid =
      testCase.expectedType === null ||
      testCase.result.type === testCase.expectedType;
    if (isValid) {
      categoryStats[cat].passed++;
    } else {
      categoryStats[cat].failed++;
    }
  }

  for (const [category, stats] of Object.entries(categoryStats)) {
    const rate = ((stats.passed / stats.total) * 100).toFixed(1);
    console.log(
      `${category.padEnd(20)}: ${stats.passed}/${stats.total} passed (${rate}%)`
    );
  }

  console.log("\n" + "=".repeat(80));
}

// Run tests
runTests();
