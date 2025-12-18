/**
 * Comprehensive test suite for MBTI personality validation
 * Tests all 16 personalities with 6 variations each (96 total test cases)
 */

const fs = require("fs");
const path = require("path");

// Load question data
const questionsByDichotomy = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "src/mbti/mbti-questions-by-dichotomy.json"),
    "utf8"
  )
);

// All 16 MBTI types
const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP", // Analysts
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP", // Diplomats
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ", // Sentinels
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP", // Explorers
];

// Extract letters from type
function getTypeLetters(type) {
  return {
    first: type[0], // E or I
    second: type[1], // S or N
    third: type[2], // T or F
    fourth: type[3], // J or P
  };
}

// Shuffle function (matches API implementation)
function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const QUESTIONS_PER_DICHOTOMY = 11;
const DICHOTOMY_LETTERS = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

// Get questions using the same selection logic as the API
// This ensures tests validate against the same question set users actually see
function getSelectedQuestions() {
  const allQuestions = [];

  Object.keys(DICHOTOMY_LETTERS).forEach((dichotomyKey) => {
    const raw = questionsByDichotomy[dichotomyKey];

    if (!raw || raw.length < QUESTIONS_PER_DICHOTOMY) {
      throw new Error(
        `Not enough questions for dichotomy ${dichotomyKey}. Expected at least ${QUESTIONS_PER_DICHOTOMY}, found ${
          raw?.length ?? 0
        }.`
      );
    }

    // Select 11 questions per dichotomy (same as API)
    const selected = shuffle(raw).slice(0, QUESTIONS_PER_DICHOTOMY);
    allQuestions.push(...selected);
  });

  // Shuffle all questions (same as API)
  return shuffle(allQuestions);
}

// Get all questions (for comprehensive testing - optional)
function getAllQuestions() {
  const allQuestions = [];
  for (const [dichotomy, questions] of Object.entries(questionsByDichotomy)) {
    allQuestions.push(...questions);
  }
  return allQuestions;
}

// Scoring function (matches the API logic)
function scoreAnswers(answers, allQuestions) {
  const scores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // Create question index
  const questionIndex = new Map();
  for (const q of allQuestions) {
    questionIndex.set(q.id, q);
  }

  // Score answers
  for (const answer of answers) {
    const question = questionIndex.get(answer.questionId);
    if (!question || answer.value === 0) continue;

    const answerValue = answer.value;
    const weights = question.weights || {};

    for (const [letter, weight] of Object.entries(weights)) {
      if (weight !== 0) {
        scores[letter] += answerValue * weight;
      }
    }
  }

  // Compute type
  const ei = scores.E >= scores.I ? "E" : "I";
  const sn = scores.S >= scores.N ? "S" : "N";
  const tf = scores.T >= scores.F ? "T" : "F";
  const jp = scores.J >= scores.P ? "J" : "P";
  const computedType = `${ei}${sn}${tf}${jp}`;

  return {
    type: computedType,
    scores: { ...scores },
  };
}

// Generate answer pattern for a personality type
function generateAnswersForType(type, variation, allQuestions) {
  const letters = getTypeLetters(type);
  const answers = [];

  // Variation strategies:
  // 1: Strong preference (mostly 2s and -2s)
  // 2: Moderate preference (mostly 1s and -1s)
  // 3: Mixed strong/moderate
  // 4: Some neutral answers (0s)
  // 5: Balanced with slight preference
  // 6: Edge case - very close scores

  for (const question of allQuestions) {
    const weights = question.weights || {};
    let answerValue = 0;

    // Determine which side aligns with the personality type
    // Check all weights to see which traits are favored
    let leftScore = 0;
    let rightScore = 0;

    // Calculate alignment scores
    for (const [letter, weight] of Object.entries(weights)) {
      if (weight === 0) continue;

      // Check if this weight aligns with the personality
      if (letter === letters.first) {
        // E/I alignment
        rightScore += weight;
      } else if (letter === (letters.first === "E" ? "I" : "E")) {
        leftScore += weight;
      } else if (letter === letters.second) {
        // S/N alignment
        rightScore += weight;
      } else if (letter === (letters.second === "S" ? "N" : "S")) {
        leftScore += weight;
      } else if (letter === letters.third) {
        // T/F alignment
        rightScore += weight;
      } else if (letter === (letters.third === "T" ? "F" : "T")) {
        leftScore += weight;
      } else if (letter === letters.fourth) {
        // J/P alignment
        rightScore += weight;
      } else if (letter === (letters.fourth === "J" ? "P" : "J")) {
        leftScore += weight;
      }
    }

    // Determine answer based on alignment
    if (rightScore > leftScore) {
      // Right option aligns with personality
      switch (variation) {
        case 1:
          answerValue = 2;
          break; // Strong
        case 2:
          answerValue = 1;
          break; // Moderate
        case 3:
          answerValue = Math.random() > 0.5 ? 2 : 1;
          break; // Mixed
        case 4:
          answerValue = Math.random() > 0.3 ? (Math.random() > 0.5 ? 2 : 1) : 0;
          break; // Some neutral
        case 5:
          answerValue = Math.random() > 0.4 ? 1 : Math.random() > 0.5 ? 2 : -1;
          break; // Balanced
        case 6:
          answerValue = Math.random() > 0.45 ? 1 : Math.random() > 0.5 ? 2 : -1;
          break; // Edge case
      }
    } else if (leftScore > rightScore) {
      // Left option aligns with personality
      switch (variation) {
        case 1:
          answerValue = -2;
          break;
        case 2:
          answerValue = -1;
          break;
        case 3:
          answerValue = Math.random() > 0.5 ? -2 : -1;
          break;
        case 4:
          answerValue =
            Math.random() > 0.3 ? (Math.random() > 0.5 ? -2 : -1) : 0;
          break;
        case 5:
          answerValue = Math.random() > 0.4 ? -1 : Math.random() > 0.5 ? -2 : 1;
          break;
        case 6:
          answerValue =
            Math.random() > 0.45 ? -1 : Math.random() > 0.5 ? -2 : 1;
          break;
      }
    } else {
      // Neutral or unclear - use variation strategy
      switch (variation) {
        case 1:
        case 2:
        case 3:
          answerValue = Math.random() > 0.5 ? 1 : -1;
          break;
        case 4:
          answerValue = Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? 1 : -1;
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

// Better answer generation using weight analysis
function generateAnswersForTypeImproved(type, variation, allQuestions) {
  const letters = getTypeLetters(type);
  const answers = [];

  for (const question of allQuestions) {
    const weights = question.weights || {};

    // Strategy: Check if the question's weights align with the target personality
    let alignmentScore = 0;

    // Positive weights favor the "right" option
    // Negative answer (left) would subtract from those weights
    // We want to choose the option that increases scores for our target traits

    const targetTraits = [
      letters.first,
      letters.second,
      letters.third,
      letters.fourth,
    ];
    const oppositeTraits = [
      letters.first === "E" ? "I" : "E",
      letters.second === "S" ? "N" : "S",
      letters.third === "T" ? "F" : "T",
      letters.fourth === "J" ? "P" : "J",
    ];

    // Calculate alignment: positive if right option helps, negative if left helps
    // Use balanced weighting for all dichotomies
    for (const [letter, weight] of Object.entries(weights)) {
      if (weight === 0) continue;

      let weightMultiplier = 1.0;

      // Boost weight for traits that match the target personality
      if (letter === letters.first || letter === oppositeTraits[0]) {
        weightMultiplier = 1.3; // E/I - 30% boost
      } else if (letter === letters.second || letter === oppositeTraits[1]) {
        weightMultiplier = 1.3; // S/N - 30% boost
      } else if (letter === letters.third || letter === oppositeTraits[2]) {
        weightMultiplier = 1.3; // T/F - 30% boost
      } else if (letter === letters.fourth || letter === oppositeTraits[3]) {
        weightMultiplier = 1.8; // J/P - 80% boost (critical for distinguishing similar types)
      }

      if (targetTraits.includes(letter)) {
        alignmentScore += weight * weightMultiplier; // Right option helps
      } else if (oppositeTraits.includes(letter)) {
        alignmentScore -= weight * weightMultiplier; // Left option helps
      }
    }

    // Determine answer value
    let answerValue = 0;

    if (alignmentScore > 0.1) {
      // Right option aligns with personality
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
      // Left option aligns with personality
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
      // Neutral alignment
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

// Run tests
function runTests() {
  console.log("=".repeat(80));
  console.log("MBTI PERSONALITY VALIDATION TEST SUITE");
  console.log("Testing all 16 personalities with 6 variations each (96 tests)");
  console.log("=".repeat(80));
  console.log("\n");

  // Use the same question selection as the API for realistic testing
  const allQuestions = getSelectedQuestions();
  console.log(
    `Questions selected: ${allQuestions.length} (${QUESTIONS_PER_DICHOTOMY} per dichotomy, same as API)`
  );
  console.log(`This matches the question set users actually see\n`);

  const results = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  const variationNames = [
    "Strong Preference",
    "Moderate Preference",
    "Mixed Strong/Moderate",
    "Some Neutral Answers",
    "Balanced Slight Preference",
    "Edge Case (Close Scores)",
  ];

  for (const type of MBTI_TYPES) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`Testing: ${type}`);
    console.log("-".repeat(80));

    for (let variation = 1; variation <= 6; variation++) {
      totalTests++;
      const answers = generateAnswersForTypeImproved(
        type,
        variation,
        allQuestions
      );
      const result = scoreAnswers(answers, allQuestions);

      const passed = result.type === type;
      if (passed) {
        passedTests++;
      } else {
        failedTests++;
      }

      const status = passed ? "✓ PASS" : "✗ FAIL";
      console.log(
        `  Variation ${variation} (${variationNames[variation - 1]}): ${status}`
      );
      console.log(`    Expected: ${type}, Got: ${result.type}`);

      if (!passed) {
        console.log(
          `    Scores: E=${result.scores.E.toFixed(
            2
          )}, I=${result.scores.I.toFixed(2)}, ` +
            `S=${result.scores.S.toFixed(2)}, N=${result.scores.N.toFixed(
              2
            )}, ` +
            `T=${result.scores.T.toFixed(2)}, F=${result.scores.F.toFixed(
              2
            )}, ` +
            `J=${result.scores.J.toFixed(2)}, P=${result.scores.P.toFixed(2)}`
        );
      }

      results.push({
        type,
        variation,
        variationName: variationNames[variation - 1],
        expected: type,
        got: result.type,
        passed,
        scores: result.scores,
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(80));
  console.log("TEST SUMMARY");
  console.log("=".repeat(80));
  console.log(`Total Tests: ${totalTests}`);
  console.log(
    `Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`
  );
  console.log(
    `Failed: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`
  );
  console.log("\n");

  // Failed tests detail
  if (failedTests > 0) {
    console.log("FAILED TESTS:");
    console.log("-".repeat(80));
    const failed = results.filter((r) => !r.passed);
    for (const test of failed) {
      console.log(
        `${test.type} - Variation ${test.variation} (${test.variationName})`
      );
      console.log(`  Expected: ${test.expected}, Got: ${test.got}`);
      const scores = test.scores;
      console.log(
        `  E: ${scores.E.toFixed(2)}, I: ${scores.I.toFixed(2)} | ` +
          `S: ${scores.S.toFixed(2)}, N: ${scores.N.toFixed(2)} | ` +
          `T: ${scores.T.toFixed(2)}, F: ${scores.F.toFixed(2)} | ` +
          `J: ${scores.J.toFixed(2)}, P: ${scores.P.toFixed(2)}`
      );
      console.log();
    }
  }

  // Per-personality summary
  console.log("\nPER-PERSONALITY RESULTS:");
  console.log("-".repeat(80));
  for (const type of MBTI_TYPES) {
    const typeResults = results.filter((r) => r.type === type);
    const typePassed = typeResults.filter((r) => r.passed).length;
    const typeFailed = typeResults.filter((r) => !r.passed).length;
    const status = typeFailed === 0 ? "✓" : "✗";
    console.log(`${status} ${type}: ${typePassed}/6 passed`);
  }

  console.log("\n" + "=".repeat(80));

  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    results,
  };
}

// Run the tests
const testResults = runTests();

// Export for potential further analysis
if (typeof module !== "undefined" && module.exports) {
  module.exports = { testResults, runTests };
}
