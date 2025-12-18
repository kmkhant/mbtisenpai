/**
 * Comprehensive test script to analyze MBTI quiz assessment issues
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

// Load scoring reference
const scoringText = fs.readFileSync(
  path.join(__dirname, "src/mbti/mbti-scoring.txt"),
  "utf8"
);

console.log("=".repeat(80));
console.log("MBTI QUIZ ASSESSMENT ANALYSIS");
console.log("=".repeat(80));
console.log("\n");

// Issue 1: Check if scoring uses question weights
console.log("ISSUE 1: Scoring System Not Using Question Weights");
console.log("-".repeat(80));
console.log("PROBLEM: The scoring API (route.ts) ignores the detailed weights");
console.log("         in question data and only uses answer value (1 or 2).");
console.log("         Questions have weights like {E: 0.72, I: 0, P: 0.65}");
console.log("         but scoring just adds Math.abs(answerValue).");
console.log("\nExample Question (ID 11):");
const exampleQ = questionsByDichotomy.EI.find((q) => q.id === 11);
if (exampleQ) {
  console.log(`  Prompt: ${exampleQ.prompt}`);
  console.log(`  Left: ${exampleQ.left}`);
  console.log(`  Right: ${exampleQ.right}`);
  console.log(`  Weights:`, JSON.stringify(exampleQ.weights, null, 2));
  console.log(`  Current scoring: If answer=2 (strongly right), adds 2 to E`);
  console.log(`  Should be: answer=2 * weight[E]=0.72 = 1.44 to E`);
  console.log(`            answer=2 * weight[P]=0.65 = 1.30 to P`);
}
console.log("\n");

// Issue 2: Check question distribution
console.log("ISSUE 2: Question Distribution");
console.log("-".repeat(80));
const dichotomyCounts = {};
for (const [key, questions] of Object.entries(questionsByDichotomy)) {
  dichotomyCounts[key] = questions.length;
  console.log(`  ${key}: ${questions.length} questions available`);
}
console.log(
  `  Total: ${Object.values(dichotomyCounts).reduce(
    (a, b) => a + b,
    0
  )} questions`
);
console.log(`  Selected per test: 11 per dichotomy = 44 total`);
console.log("\n");

// Issue 3: Check for questions with weights affecting multiple dichotomies
console.log("ISSUE 3: Questions Affecting Multiple Dichotomies");
console.log("-".repeat(80));
let multiDichotomyCount = 0;
const examples = [];

for (const [dichotomy, questions] of Object.entries(questionsByDichotomy)) {
  for (const q of questions) {
    const nonZeroWeights = Object.entries(q.weights || {}).filter(
      ([_, val]) => val > 0
    );

    if (nonZeroWeights.length > 2) {
      multiDichotomyCount++;
      if (examples.length < 5) {
        examples.push({
          id: q.id,
          dichotomy,
          prompt: q.prompt,
          weights: q.weights,
        });
      }
    }
  }
}

console.log(
  `  Found ${multiDichotomyCount} questions affecting multiple dichotomies`
);
console.log(`  Current system only uses the primary dichotomy for scoring.`);
console.log(`  This means secondary effects are ignored.`);
console.log("\nExamples:");
examples.forEach((ex) => {
  console.log(
    `  Q${ex.id} (${ex.dichotomy}): ${ex.prompt.substring(0, 60)}...`
  );
  const activeWeights = Object.entries(ex.weights)
    .filter(([_, v]) => v > 0)
    .map(([k, v]) => `${k}:${v.toFixed(2)}`)
    .join(", ");
  console.log(`    Active weights: ${activeWeights}`);
});
console.log("\n");

// Issue 4: Check answer value mapping
console.log("ISSUE 4: Answer Value to Weight Mapping");
console.log("-".repeat(80));
console.log("Current system:");
console.log("  -2 (strongly left)  -> adds 2 to leftLetter");
console.log("  -1 (slightly left)  -> adds 1 to leftLetter");
console.log("   0 (neutral)        -> ignored");
console.log("   1 (slightly right) -> adds 1 to rightLetter");
console.log("   2 (strongly right) -> adds 2 to rightLetter");
console.log("\nProblem: Should multiply answer value by question weights");
console.log("  Example: If question has weight E:0.72, P:0.65");
console.log(
  "    Answer -2 should add: -2 * 0.72 = -1.44 to E, -2 * 0.65 = -1.30 to P"
);
console.log(
  "    Answer +2 should add: +2 * 0.72 = +1.44 to E, +2 * 0.65 = +1.30 to P"
);
console.log("\n");

// Issue 5: Check for questions with zero weights in primary dichotomy
console.log("ISSUE 5: Questions with Zero Primary Dichotomy Weights");
console.log("-".repeat(80));
let zeroPrimaryCount = 0;
const zeroPrimaryExamples = [];

for (const [dichotomy, questions] of Object.entries(questionsByDichotomy)) {
  const [leftLetter, rightLetter] =
    dichotomy === "EI"
      ? ["E", "I"]
      : dichotomy === "SN"
      ? ["S", "N"]
      : dichotomy === "TF"
      ? ["T", "F"]
      : ["J", "P"];

  for (const q of questions) {
    const leftWeight = (q.weights || {})[leftLetter] || 0;
    const rightWeight = (q.weights || {})[rightLetter] || 0;

    if (leftWeight === 0 && rightWeight === 0) {
      zeroPrimaryCount++;
      if (zeroPrimaryExamples.length < 3) {
        zeroPrimaryExamples.push({
          id: q.id,
          dichotomy,
          prompt: q.prompt,
          weights: q.weights,
        });
      }
    }
  }
}

console.log(
  `  Found ${zeroPrimaryCount} questions with zero weights in primary dichotomy`
);
if (zeroPrimaryCount > 0) {
  console.log(
    `  These questions won't contribute to their assigned dichotomy at all!`
  );
  console.log("\nExamples:");
  zeroPrimaryExamples.forEach((ex) => {
    console.log(
      `  Q${ex.id} (${ex.dichotomy}): ${ex.prompt.substring(0, 60)}...`
    );
    const activeWeights = Object.entries(ex.weights)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => `${k}:${v.toFixed(2)}`)
      .join(", ");
    console.log(`    Active weights: ${activeWeights}`);
  });
}
console.log("\n");

// Issue 6: Check scoring calculation logic
console.log("ISSUE 6: Scoring Calculation Logic");
console.log("-".repeat(80));
console.log("Current logic in score/route.ts:");
console.log("  1. Gets dichotomy from QUESTION_INDEX");
console.log("  2. Determines leftLetter/rightLetter from dichotomy");
console.log("  3. Adds Math.abs(answerValue) to appropriate letter");
console.log("  4. Ignores all question weights");
console.log("\nProblems:");
console.log("  - No weight multiplication");
console.log("  - No consideration of secondary dichotomy effects");
console.log("  - Simple addition doesn't reflect question importance");
console.log("\n");

// Issue 7: Check percentage calculation
console.log("ISSUE 7: Percentage Calculation");
console.log("-".repeat(80));
console.log("Current: percentages[a] = Math.round((scores[a] / total) * 100)");
console.log("Issue: Rounding can cause percentages to not sum to 100");
console.log("  Example: If E=51, I=49, then E%=51%, I%=49% (sums to 100)");
console.log(
  "          But if E=50.5, I=49.5, then E%=51%, I%=50% (sums to 101!)"
);
console.log("Current code handles this: percentages[b] = 100 - percentages[a]");
console.log("  This is correct, but could be clearer.");
console.log("\n");

// Summary
console.log("=".repeat(80));
console.log("SUMMARY OF CRITICAL ISSUES");
console.log("=".repeat(80));
console.log("\n1. CRITICAL: Scoring ignores question weights");
console.log(
  "   - Questions have detailed weights but scoring uses simple 1/2 values"
);
console.log("   - This makes all questions equally important");
console.log("   - Should multiply answer value by question weights\n");

console.log("2. CRITICAL: Secondary dichotomy effects ignored");
console.log("   - Many questions affect multiple dichotomies");
console.log("   - Current system only uses primary dichotomy");
console.log("   - Should apply all non-zero weights from question\n");

console.log("3. MODERATE: Questions with zero primary weights");
console.log(
  "   - Some questions assigned to a dichotomy have zero weight for it"
);
console.log("   - These questions won't contribute to their dichotomy\n");

console.log("4. MINOR: Percentage calculation could be clearer");
console.log("   - Works correctly but implementation could be improved\n");

console.log("=".repeat(80));
