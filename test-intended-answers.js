/**
 * Test script to generate intended answers for each MBTI type
 * and verify that the scoring algorithm produces the intended result
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const questionsByDichotomy = JSON.parse(
  readFileSync(
    join(__dirname, "src/mbti/mbti-questions-by-dichotomy.json"),
    "utf-8"
  )
);

// Build question index
const QUESTION_INDEX = new Map();
const allQuestionIds = [];

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
      allQuestionIds.push(q.id);
    }
  }
}

// Scoring logic
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

function emptyScores() {
  return {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };
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

  return scores;
}

/**
 * Generate answers intended to produce a specific MBTI type
 */
function generateIntendedAnswers(targetType, strength = 1.5) {
  const [targetE, targetS, targetT, targetJ] = targetType.split("");
  const answers = [];

  // Map of target preferences
  const targetPreferences = {
    EI: targetE,
    SN: targetS,
    TF: targetT,
    JP: targetJ,
  };

  // Generate answers for each question
  for (const questionId of allQuestionIds) {
    const meta = QUESTION_INDEX.get(questionId);
    if (!meta) continue;

    const dichotomy = meta.dichotomy;
    const targetPreference = targetPreferences[dichotomy];
    if (!targetPreference) continue;

    // Calculate which answer value would favor the target preference
    const weights = meta.weights;
    const targetWeight = weights[targetPreference] || 0;
    const oppositePreference = dichotomyPairs[targetPreference];
    const oppositeWeight = weights[oppositePreference] || 0;

    // Determine answer value based on weights
    let answerValue = 0;

    if (targetWeight > 0 && oppositeWeight === 0) {
      // This question only favors the target, answer strongly positive
      answerValue = Math.floor(Math.random() * 2) + 1; // 1 or 2
    } else if (targetWeight === 0 && oppositeWeight > 0) {
      // This question only favors the opposite, answer strongly negative
      answerValue = -(Math.floor(Math.random() * 2) + 1); // -1 or -2
    } else if (targetWeight > oppositeWeight) {
      // Target weight is higher, answer positive
      const baseValue = Math.floor(Math.random() * 2) + 1;
      answerValue = baseValue;
    } else if (oppositeWeight > targetWeight) {
      // Opposite weight is higher, answer negative
      const baseValue = Math.floor(Math.random() * 2) + 1;
      answerValue = -baseValue;
    } else if (targetWeight === oppositeWeight && targetWeight > 0) {
      // Equal weights, randomly favor target
      answerValue = Math.random() > 0.3 ? 1 : -1;
    } else {
      // No weights or neutral, use random but slightly favor target
      answerValue = Math.random() > 0.4 ? 1 : -1;
    }

    // Apply strength multiplier
    if (answerValue !== 0) {
      const sign = answerValue > 0 ? 1 : -1;
      const absValue = Math.abs(answerValue);
      answerValue = sign * Math.min(2, Math.floor(absValue * strength));
    }

    answers.push({
      questionId,
      value: answerValue,
    });
  }

  return answers;
}

/**
 * Test a single intended type
 */
function testIntendedType(targetType, testNumber) {
  const answers = generateIntendedAnswers(targetType);
  const scores = scoreAnswers(answers);
  const computedType = computeType(scores);

  const passed = computedType === targetType;
  const scoreDifference = {
    EI: Math.abs(scores[targetType[0]] - scores[dichotomyPairs[targetType[0]]]),
    SN: Math.abs(scores[targetType[1]] - scores[dichotomyPairs[targetType[1]]]),
    TF: Math.abs(scores[targetType[2]] - scores[dichotomyPairs[targetType[2]]]),
    JP: Math.abs(scores[targetType[3]] - scores[dichotomyPairs[targetType[3]]]),
  };

  return {
    testNumber,
    targetType,
    computedType,
    passed,
    scores,
    scoreDifference,
    answersCount: answers.length,
  };
}

/**
 * Run all tests
 */
function runTests() {
  console.log("🧪 Testing Intended Answers Validation\n");
  console.log(
    "Generating intended answers for each MBTI type and verifying results...\n"
  );

  const allTypes = [
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

  const results = [];
  const typeResults = {};

  // Test each type multiple times
  const testsPerType = 10;
  let testNumber = 1;

  for (const type of allTypes) {
    const typeTests = [];
    let passedCount = 0;

    for (let i = 0; i < testsPerType; i++) {
      const result = testIntendedType(type, testNumber);
      typeTests.push(result);
      results.push(result);
      if (result.passed) passedCount++;
      testNumber++;
    }

    typeResults[type] = {
      passed: passedCount,
      total: testsPerType,
      passRate: (passedCount / testsPerType) * 100,
      tests: typeTests,
    };
  }

  // Display results
  console.log("=".repeat(70));
  console.log("📊 TEST RESULTS BY TYPE");
  console.log("=".repeat(70));

  for (const type of allTypes) {
    const result = typeResults[type];
    const status = result.passed === result.total ? "✅" : "⚠️";
    console.log(
      `${status} ${type}: ${result.passed}/${
        result.total
      } passed (${result.passRate.toFixed(1)}%)`
    );
  }

  // Overall statistics
  const totalPassed = results.filter((r) => r.passed).length;
  const totalTests = results.length;
  const overallPassRate = (totalPassed / totalTests) * 100;

  console.log("\n" + "=".repeat(70));
  console.log("📊 OVERALL SUMMARY");
  console.log("=".repeat(70));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${totalPassed} (${overallPassRate.toFixed(1)}%)`);
  console.log(
    `❌ Failed: ${totalTests - totalPassed} (${(100 - overallPassRate).toFixed(
      1
    )}%)`
  );

  // Show failed cases
  const failedResults = results.filter((r) => !r.passed);
  if (failedResults.length > 0) {
    console.log("\n❌ Failed Cases:");
    console.log("-".repeat(70));

    // Group by type
    const failedByType = {};
    for (const failed of failedResults) {
      if (!failedByType[failed.targetType]) {
        failedByType[failed.targetType] = [];
      }
      failedByType[failed.targetType].push(failed);
    }

    for (const [type, failures] of Object.entries(failedByType)) {
      console.log(`\n${type} (${failures.length} failure(s)):`);
      for (const failure of failures.slice(0, 3)) {
        console.log(
          `  Test #${failure.testNumber}: Expected ${failure.targetType}, got ${failure.computedType}`
        );
        console.log(
          `    Score differences: E/I=${failure.scoreDifference.EI.toFixed(
            1
          )}, S/N=${failure.scoreDifference.SN.toFixed(
            1
          )}, T/F=${failure.scoreDifference.TF.toFixed(
            1
          )}, J/P=${failure.scoreDifference.JP.toFixed(1)}`
        );
      }
      if (failures.length > 3) {
        console.log(`  ... and ${failures.length - 3} more failures`);
      }
    }
  }

  // Score difference analysis
  console.log("\n" + "=".repeat(70));
  console.log("📈 Score Difference Analysis (Average)");
  console.log("=".repeat(70));

  const avgScoreDiff = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };

  for (const result of results) {
    avgScoreDiff.EI += result.scoreDifference.EI;
    avgScoreDiff.SN += result.scoreDifference.SN;
    avgScoreDiff.TF += result.scoreDifference.TF;
    avgScoreDiff.JP += result.scoreDifference.JP;
  }

  for (const [dichotomy, avg] of Object.entries(avgScoreDiff)) {
    avgScoreDiff[dichotomy] = avg / results.length;
  }

  console.log(`E/I: ${avgScoreDiff.EI.toFixed(2)}`);
  console.log(`S/N: ${avgScoreDiff.SN.toFixed(2)}`);
  console.log(`T/F: ${avgScoreDiff.TF.toFixed(2)}`);
  console.log(`J/P: ${avgScoreDiff.JP.toFixed(2)}`);

  // Final verdict
  console.log("\n" + "=".repeat(70));
  if (overallPassRate >= 95) {
    console.log("✅ VALIDATION: PASSED (≥95% pass rate)");
  } else if (overallPassRate >= 80) {
    console.log("⚠️  VALIDATION: MARGINAL (80-95% pass rate)");
  } else {
    console.log("❌ VALIDATION: FAILED (<80% pass rate)");
  }
  console.log("=".repeat(70) + "\n");

  return {
    total: totalTests,
    passed: totalPassed,
    failed: totalTests - totalPassed,
    passRate: overallPassRate,
    typeResults,
    avgScoreDiff,
  };
}

// Run the tests
runTests();
