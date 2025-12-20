#!/usr/bin/env node

/**
 * Debug script to analyze comprehensive mode test failures
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

// Import the test functions
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// We'll need to replicate the key logic here
const DICHOTOMY_LETTERS = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

// Build question index
const QUESTION_INDEX = new Map();
for (const [dichotomyKey, questions] of Object.entries(questionsByDichotomy)) {
  for (const q of questions) {
    QUESTION_INDEX.set(q.id, {
      weights: q.weights || {},
      dichotomy: dichotomyKey,
    });
  }
}

// Test one failing case: INTJ Variation 1
function analyzeFailingCase() {
  console.log("Analyzing INTJ Variation 1 failure...\n");

  // Get comprehensive mode questions (simplified - just get all questions)
  const allQuestions = [];
  for (const questions of Object.values(questionsByDichotomy)) {
    allQuestions.push(...questions);
  }

  // Generate answers for INTJ Variation 1
  const type = "INTJ";
  const variation = 1;
  const letters = {
    first: type[0], // I
    second: type[1], // N
    third: type[2], // T
    fourth: type[3], // J
  };

  let alignmentStats = {
    strongRight: 0,
    strongLeft: 0,
    weakRight: 0,
    weakLeft: 0,
    neutral: 0,
  };

  const answers = [];
  for (const question of allQuestions) {
    const weights = QUESTION_INDEX.get(question.id)?.weights || {};
    let alignmentScore = 0;

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
      answerValue = 2; // Variation 1: strong right
      alignmentStats.strongRight++;
    } else if (alignmentScore < -0.1) {
      answerValue = -2; // Variation 1: strong left
      alignmentStats.strongLeft++;
    } else {
      // Neutral - for variation 1, this should be alignmentScore > 0 ? 1 : -1
      answerValue = alignmentScore > 0 ? 1 : -1;
      if (Math.abs(alignmentScore) < 0.01) {
        alignmentStats.neutral++;
      } else if (alignmentScore > 0) {
        alignmentStats.weakRight++;
      } else {
        alignmentStats.weakLeft++;
      }
    }

    answers.push({
      questionId: question.id,
      value: answerValue,
    });
  }

  console.log("Alignment Statistics:");
  console.log(alignmentStats);
  console.log(`Total questions: ${allQuestions.length}`);
  console.log(
    `Neutral/weak questions: ${
      alignmentStats.neutral +
      alignmentStats.weakRight +
      alignmentStats.weakLeft
    }`
  );

  // Score the answers
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
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

  for (const answer of answers) {
    const meta = QUESTION_INDEX.get(answer.questionId);
    if (!meta) continue;

    const answerValue = answer.value;
    const weights = meta.weights;

    for (const [letter, weight] of Object.entries(weights)) {
      if (weight === 0) continue;
      const opposite = dichotomyPairs[letter];
      if (opposite) {
        scores[letter] += answerValue * weight;
        scores[opposite] -= answerValue * weight;
      }
    }
  }

  const ei = scores.E >= scores.I ? "E" : "I";
  const sn = scores.S >= scores.N ? "S" : "N";
  const tf = scores.T >= scores.F ? "T" : "F";
  const jp = scores.J >= scores.P ? "J" : "P";
  const resultType = `${ei}${sn}${tf}${jp}`;

  console.log("\nScores:");
  console.log(`E: ${scores.E.toFixed(2)}, I: ${scores.I.toFixed(2)}`);
  console.log(`S: ${scores.S.toFixed(2)}, N: ${scores.N.toFixed(2)}`);
  console.log(`T: ${scores.T.toFixed(2)}, F: ${scores.F.toFixed(2)}`);
  console.log(`J: ${scores.J.toFixed(2)}, P: ${scores.P.toFixed(2)}`);
  console.log(`\nExpected: INTJ`);
  console.log(`Got: ${resultType}`);

  // Show the problematic dichotomy
  if (resultType !== "INTJ") {
    console.log("\nProblematic dichotomy:");
    if (ei !== "I") console.log(`  E/I: Expected I, got ${ei}`);
    if (sn !== "N") console.log(`  S/N: Expected N, got ${sn}`);
    if (tf !== "T") console.log(`  T/F: Expected T, got ${tf}`);
    if (jp !== "J") console.log(`  J/P: Expected J, got ${jp}`);
  }
}

analyzeFailingCase();
