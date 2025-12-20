#!/usr/bin/env node

/**
 * Comprehensive Mode Test Suite - 160 Test Cases
 * Tests comprehensive mode (88 questions) scoring and question selection
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

const QUESTIONS_PER_DICHOTOMY_COMPREHENSIVE = 22;
const EXPECTED_QUESTIONS_COUNT_COMPREHENSIVE = 88;

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

// Seeded shuffle (same as API)
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
  return Math.floor(now.getTime() / (1000 * 60));
}

// Get selected questions for comprehensive mode (same logic as API)
function getSelectedQuestionsComprehensive() {
  const rotationSeed = getRotationSeed();
  const allQuestions = [];
  const usedQuestionIds = new Set();
  const QUESTIONS_PER_DICHOTOMY = QUESTIONS_PER_DICHOTOMY_COMPREHENSIVE;

  Object.keys(DICHOTOMY_LETTERS).forEach((dichotomyKey) => {
    const raw = questionsByDichotomy[dichotomyKey];
    if (!raw || raw.length < QUESTIONS_PER_DICHOTOMY) {
      throw new Error(`Not enough questions for ${dichotomyKey}`);
    }

    const [leftLetter, rightLetter] = DICHOTOMY_LETTERS[dichotomyKey];
    const dichotomySeed =
      rotationSeed +
      dichotomyKey.charCodeAt(0) * 1000 +
      dichotomyKey.charCodeAt(1) * 100;
    const shuffled = seededShuffle(raw, dichotomySeed);

    const leftBiased = [];
    const rightBiased = [];
    const neutral = [];

    for (const q of shuffled) {
      if (usedQuestionIds.has(q.id)) {
        continue;
      }

      const weights = q.weights || {};
      const leftWeight = weights[leftLetter] || 0;
      const rightWeight = weights[rightLetter] || 0;

      if (leftWeight > rightWeight) {
        leftBiased.push(q);
      } else if (rightWeight > leftWeight) {
        rightBiased.push(q);
      } else {
        neutral.push(q);
      }
    }

    // Comprehensive mode: 11-11 split
    const targetLeft = 11;
    const targetRight = 11;

    const selected = [];
    let leftCount = 0;
    let rightCount = 0;

    // Fill from biased questions
    for (const q of leftBiased) {
      if (leftCount >= targetLeft) break;
      if (usedQuestionIds.has(q.id)) continue;
      selected.push({
        id: q.id,
        prompt: q.prompt,
        left: q.left,
        right: q.right,
        dichotomy: dichotomyKey,
        leftLetter,
        rightLetter,
      });
      usedQuestionIds.add(q.id);
      leftCount++;
    }

    for (const q of rightBiased) {
      if (rightCount >= targetRight) break;
      if (usedQuestionIds.has(q.id)) continue;
      selected.push({
        id: q.id,
        prompt: q.prompt,
        left: q.left,
        right: q.right,
        dichotomy: dichotomyKey,
        leftLetter,
        rightLetter,
      });
      usedQuestionIds.add(q.id);
      rightCount++;
    }

    // Fill remaining from neutral
    for (const q of neutral) {
      if (selected.length >= QUESTIONS_PER_DICHOTOMY) break;
      if (usedQuestionIds.has(q.id)) continue;
      selected.push({
        id: q.id,
        prompt: q.prompt,
        left: q.left,
        right: q.right,
        dichotomy: dichotomyKey,
        leftLetter,
        rightLetter,
      });
      usedQuestionIds.add(q.id);
    }

    // If still not enough, fill from other dichotomies
    if (selected.length < QUESTIONS_PER_DICHOTOMY) {
      const otherDichotomies = Object.keys(DICHOTOMY_LETTERS).filter(
        (key) => key !== dichotomyKey
      );

      const otherLeftBiased = [];
      const otherRightBiased = [];
      const otherNeutral = [];

      for (const otherKey of otherDichotomies) {
        const otherRaw = questionsByDichotomy[otherKey];
        if (!otherRaw) continue;

        for (const q of otherRaw) {
          if (usedQuestionIds.has(q.id)) continue;

          const weights = q.weights || {};
          const leftWeight = weights[leftLetter] || 0;
          const rightWeight = weights[rightLetter] || 0;

          if (leftWeight > rightWeight) {
            otherLeftBiased.push(q);
          } else if (rightWeight > leftWeight) {
            otherRightBiased.push(q);
          } else {
            otherNeutral.push(q);
          }
        }
      }

      const otherLeftShuffled = seededShuffle(
        otherLeftBiased,
        dichotomySeed + 1000
      );
      const otherRightShuffled = seededShuffle(
        otherRightBiased,
        dichotomySeed + 2000
      );
      const otherNeutralShuffled = seededShuffle(
        otherNeutral,
        dichotomySeed + 3000
      );

      while (selected.length < QUESTIONS_PER_DICHOTOMY) {
        const needsLeft = leftCount < targetLeft;
        const needsRight = rightCount < targetRight;
        const canTakeLeft = otherLeftShuffled.length > 0;
        const canTakeRight = otherRightShuffled.length > 0;

        let added = false;

        if (
          needsLeft &&
          canTakeLeft &&
          (!needsRight || leftCount <= rightCount)
        ) {
          const q = otherLeftShuffled.shift();
          if (q && !usedQuestionIds.has(q.id)) {
            selected.push({
              id: q.id,
              prompt: q.prompt,
              left: q.left,
              right: q.right,
              dichotomy: dichotomyKey,
              leftLetter,
              rightLetter,
            });
            usedQuestionIds.add(q.id);
            leftCount++;
            added = true;
          }
        } else if (
          needsRight &&
          canTakeRight &&
          (!needsLeft || rightCount <= leftCount)
        ) {
          const q = otherRightShuffled.shift();
          if (q && !usedQuestionIds.has(q.id)) {
            selected.push({
              id: q.id,
              prompt: q.prompt,
              left: q.left,
              right: q.right,
              dichotomy: dichotomyKey,
              leftLetter,
              rightLetter,
            });
            usedQuestionIds.add(q.id);
            rightCount++;
            added = true;
          }
        } else if (otherNeutralShuffled.length > 0) {
          const q = otherNeutralShuffled.shift();
          if (q && !usedQuestionIds.has(q.id)) {
            selected.push({
              id: q.id,
              prompt: q.prompt,
              left: q.left,
              right: q.right,
              dichotomy: dichotomyKey,
              leftLetter,
              rightLetter,
            });
            usedQuestionIds.add(q.id);
            added = true;
          }
        } else if (canTakeLeft || canTakeRight) {
          const q = canTakeLeft
            ? otherLeftShuffled.shift()
            : otherRightShuffled.shift();
          if (q && !usedQuestionIds.has(q.id)) {
            selected.push({
              id: q.id,
              prompt: q.prompt,
              left: q.left,
              right: q.right,
              dichotomy: dichotomyKey,
              leftLetter,
              rightLetter,
            });
            usedQuestionIds.add(q.id);
            added = true;
          }
        }

        if (!added) break;
      }
    }

    if (selected.length < QUESTIONS_PER_DICHOTOMY) {
      throw new Error(
        `Not enough questions for ${dichotomyKey}. Expected ${QUESTIONS_PER_DICHOTOMY}, got ${selected.length}`
      );
    }

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

const dichotomyPairs = {
  E: "I",
  I: "E",
  S: "N",
  N: "S",
  T: "F",
  F: "T",
  J: "P",
  P: "J",
};

function scoreAnswers(answers) {
  const scores = emptyScores();

  for (const answer of answers) {
    const meta = QUESTION_INDEX.get(answer.questionId);
    if (!meta) continue;

    const answerValue = answer.value;
    if (answerValue === 0) continue;

    const strength = Math.abs(answerValue);
    const isRight = answerValue > 0;

    for (const [letter, weight] of Object.entries(meta.weights)) {
      if (weight !== 0) {
        if (isRight) {
          scores[letter] += strength * weight;
        } else {
          const oppositeLetter = dichotomyPairs[letter];
          scores[oppositeLetter] += strength * weight;
        }
      }
    }
  }

  // Check if all scores are zero
  const allScoresZero = Object.values(scores).every((s) => s === 0);
  if (allScoresZero) {
    return {
      type: "XXXX",
      scores: emptyScores(),
      percentages: { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 },
    };
  }

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

  return {
    type: computeType(scores),
    scores,
    percentages,
  };
}

// Generate answers for a specific type (using alignment score like test-100-cases.js)
function generateAnswersForType(type, allQuestions, variation) {
  const letters = {
    first: type[0], // E/I
    second: type[1], // S/N
    third: type[2], // T/F
    fourth: type[3], // J/P
  };

  const answers = [];

  for (const question of allQuestions) {
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
        case 7:
          answerValue =
            Math.random() > 0.3
              ? 1
              : Math.random() > 0.4
              ? 2
              : Math.random() > 0.5
              ? -1
              : 0;
          break;
        case 8:
          answerValue =
            Math.random() > 0.5
              ? Math.random() > 0.5
                ? 2
                : 1
              : Math.random() > 0.5
              ? -1
              : 0;
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
        case 7:
          answerValue =
            Math.random() > 0.3
              ? -1
              : Math.random() > 0.4
              ? -2
              : Math.random() > 0.5
              ? 1
              : 0;
          break;
        case 8:
          answerValue =
            Math.random() > 0.5
              ? Math.random() > 0.5
                ? -2
                : -1
              : Math.random() > 0.5
              ? 1
              : 0;
          break;
      }
    } else {
      // Neutral alignment (alignmentScore between -0.1 and 0.1)
      // For variations 1-2, use stronger values to ensure correct type
      // Even if alignment is weak, follow the alignmentScore direction
      switch (variation) {
        case 1:
          // Variation 1: Strong answers - use 2/-2 even for neutral to ensure type
          answerValue = alignmentScore >= 0 ? 2 : -2;
          break;
        case 2:
          // Variation 2: Moderate answers - use 1/-1 for neutral
          answerValue = alignmentScore >= 0 ? 1 : -1;
          break;
        case 3:
          answerValue = alignmentScore > 0 ? 1 : -1;
          break;
        case 4:
          answerValue = Math.random() > 0.4 ? 0 : alignmentScore > 0 ? 1 : -1;
          break;
        case 5:
        case 6:
        case 7:
        case 8:
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

// Generate random answers
function generateRandomAnswers(allQuestions) {
  const answers = [];
  for (const question of allQuestions) {
    const value = [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
    answers.push({
      questionId: question.id,
      value,
    });
  }
  return answers;
}

// Generate all neutral answers
function generateAllNeutralAnswers(allQuestions) {
  return allQuestions.map((q) => ({
    questionId: q.id,
    value: 0,
  }));
}

// Generate incomplete answers
function generateIncompleteAnswers(allQuestions, count) {
  const answers = [];
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const value = [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
    answers.push({
      questionId: shuffled[i].id,
      value,
    });
  }
  return answers;
}

// Test execution
function runTests() {
  console.log("=".repeat(80));
  console.log("Comprehensive Mode Test Suite - 160 Test Cases");
  console.log("=".repeat(80));
  console.log();

  let allQuestions;
  try {
    allQuestions = getSelectedQuestionsComprehensive();
    console.log(
      `✅ Successfully selected ${allQuestions.length} questions for comprehensive mode`
    );
    console.log(
      `   Expected: ${EXPECTED_QUESTIONS_COUNT_COMPREHENSIVE}, Got: ${allQuestions.length}\n`
    );
  } catch (error) {
    console.error(`❌ Failed to select questions: ${error.message}`);
    return;
  }

  // Validate question count
  if (allQuestions.length !== EXPECTED_QUESTIONS_COUNT_COMPREHENSIVE) {
    console.error(
      `❌ Question count mismatch! Expected ${EXPECTED_QUESTIONS_COUNT_COMPREHENSIVE}, got ${allQuestions.length}`
    );
    return;
  }

  // Validate uniqueness
  const questionIds = new Set(allQuestions.map((q) => q.id));
  if (questionIds.size !== allQuestions.length) {
    console.error(
      `❌ Duplicate questions detected! Expected ${allQuestions.length} unique, got ${questionIds.size}`
    );
    return;
  }

  console.log("✅ All questions are unique\n");

  const testCases = [];
  let testId = 1;

  // Test 1-128: All 16 types × 8 variations each
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
    for (let variation = 1; variation <= 8; variation++) {
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

  // Test 129-144: Random valid answers (16 cases)
  for (let i = 0; i < 16; i++) {
    const answers = generateRandomAnswers(allQuestions);
    const result = scoreAnswers(answers);
    testCases.push({
      id: testId++,
      name: `Random Answers ${i + 1}`,
      expectedType: null,
      answers,
      result,
      category: "Random",
    });
  }

  // Test 145-150: Edge cases - All neutral (6 cases)
  for (let i = 0; i < 6; i++) {
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

  // Test 151-160: Incomplete quizzes (10 cases)
  for (let i = 0; i < 10; i++) {
    const count = Math.floor(Math.random() * 40) + 40; // 40-80 questions
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

  console.log(`Generated ${testCases.length} test cases\n`);

  let passed = 0;
  let failed = 0;
  let warnings = 0;
  const failures = [];
  const warningsList = [];

  for (const testCase of testCases) {
    const { result, expectedType, name, category } = testCase;

    // Validate answer count
    if (
      testCase.answers.length !== EXPECTED_QUESTIONS_COUNT_COMPREHENSIVE &&
      category !== "Incomplete"
    ) {
      warnings++;
      warningsList.push({
        test: name,
        issue: `Expected ${EXPECTED_QUESTIONS_COUNT_COMPREHENSIVE} answers, got ${testCase.answers.length}`,
      });
    }

    // Validate type if expected
    if (expectedType !== null) {
      if (result.type === expectedType) {
        passed++;
      } else {
        failed++;
        failures.push({
          test: name,
          expected: expectedType,
          got: result.type,
          scores: result.scores,
          percentages: result.percentages,
        });
      }
    } else {
      // For random/incomplete tests, just validate structure
      if (
        result.type &&
        result.scores &&
        result.percentages &&
        typeof result.type === "string" &&
        result.type.length === 4
      ) {
        passed++;
      } else {
        failed++;
        failures.push({
          test: name,
          issue: "Invalid result structure",
          result,
        });
      }
    }

    // Validate percentages sum to 100
    const pairs = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"],
    ];
    for (const [a, b] of pairs) {
      const sum = result.percentages[a] + result.percentages[b];
      if (sum !== 100) {
        warnings++;
        warningsList.push({
          test: name,
          issue: `Percentages for ${a}/${b} sum to ${sum}, expected 100`,
        });
      }
    }
  }

  // Report results
  console.log("=".repeat(80));
  console.log("TEST RESULTS");
  console.log("=".repeat(80));
  console.log(`Total Tests: ${testCases.length}`);
  console.log(
    `✅ Passed: ${passed} (${((passed / testCases.length) * 100).toFixed(1)}%)`
  );
  console.log(
    `❌ Failed: ${failed} (${((failed / testCases.length) * 100).toFixed(1)}%)`
  );
  console.log(`⚠️  Warnings: ${warnings}`);

  if (failures.length > 0) {
    console.log("\n" + "=".repeat(80));
    console.log("FAILED TESTS");
    console.log("=".repeat(80));
    for (const failure of failures.slice(0, 20)) {
      console.log(`\n❌ ${failure.test}`);
      if (failure.expected) {
        console.log(`   Expected: ${failure.expected}`);
        console.log(`   Got: ${failure.got}`);
      } else {
        console.log(`   Issue: ${failure.issue}`);
      }
    }
    if (failures.length > 20) {
      console.log(`\n... and ${failures.length - 20} more failures`);
    }
  }

  if (warningsList.length > 0 && warningsList.length <= 10) {
    console.log("\n" + "=".repeat(80));
    console.log("WARNINGS");
    console.log("=".repeat(80));
    for (const warning of warningsList) {
      console.log(`⚠️  ${warning.test}: ${warning.issue}`);
    }
  }

  console.log("\n" + "=".repeat(80));
  const passRate = ((passed / testCases.length) * 100).toFixed(1);
  if (failed === 0) {
    console.log(`✅ ALL TESTS PASSED (${passRate}%)`);
  } else {
    console.log(`❌ SOME TESTS FAILED (${passRate}% pass rate)`);
  }
  console.log("=".repeat(80));

  process.exit(failed === 0 ? 0 : 1);
}

runTests();
