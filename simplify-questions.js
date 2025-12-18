#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Read the questions file
const filePath = path.join(
  __dirname,
  "src/mbti/mbti-questions-by-dichotomy.json"
);
const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Common adjectives that need "are you more" instead of "do you"
const adjectives = [
  "careful",
  "extreme",
  "confident",
  "unsure",
  "angry",
  "resentful",
  "trusting",
  "paranoid",
  "energetic",
  "mellow",
  "friendly",
  "distant",
  "tense",
  "relaxed",
  "timid",
  "offensive",
  "hopeful",
  "fearful",
  "comfortable",
  "troubled",
  "eager",
  "reluctant",
  "somber",
  "enthusiastic",
  "cautious",
  "bold",
  "spontaneous",
  "deliberate",
  "well-rounded",
  "deep",
  "flowing",
  "twitching",
];

// Function to simplify text to simple English
function simplify(text) {
  if (!text) return text;

  // Convert to lowercase for processing
  let simplified = text.toLowerCase().trim();

  // Replace complex phrases with simple ones
  const replacements = {
    // Question starters - make them all consistent
    "which feels more like you:": "",
    "deep down, are you more": "are you more",
    "in everyday life, are you more": "are you more",
    "day to day, are you more": "are you more",
    "when people describe you, are you more": "are you more",

    // Fix awkward verb forms
    "are you more learn": "do you learn",
    "are you more like": "do you like",
    "are you more want": "do you want",
    "are you more think": "do you think",
    "are you more talk": "do you talk",
    "are you more work": "do you work",
    "are you more have": "do you have",
    "are you more feel": "do you feel",
    "are you more keep": "do you keep",
    "are you more tell": "do you tell",
    "are you more notice": "do you notice",
    "are you more hate": "do you hate",
    "are you more accept": "do you accept",
    "are you more criticize": "do you criticize",
    "are you more come": "do you come",
    "are you more judge": "do you judge",
    "are you more prefer": "do you prefer",
    "are you more care": "do you care",

    // Complex phrases - simplify
    "talks over a decision with other people": "talk to others before deciding",
    "makes it alone": "decide alone",
    "learns before doing": "learn first, then do",
    "learns while doing": "learn by doing",
    "learns by doing": "learn by doing",
    "learns by watching": "learn by watching",
    "often thinks about what they should have done differently":
      "think about mistakes",
    "does not second guess": "don't think about mistakes",
    "likes small talk": "like small talk",
    "hates small talk": "hate small talk",
    "wants to be treated right": "want to be treated well",
    "just doesn't want to be treated wrong": "don't want to be treated badly",
    "wants a destiny": "want a plan",
    "afraid of fate": "afraid of plans",
    "manipulates things behind the scenes": "work behind the scenes",
    "leads from the front": "lead from the front",
    "feels unlucky": "feel unlucky",
    "feels very lucky": "feel lucky",
    "wants loyal friends": "want loyal friends",
    "wants fun friends": "want fun friends",
    "no one knows what they are talking about":
      "no one knows what they're talking about",
    "some people know what they are talking about":
      "some people know what they're talking about",
    "like to listen to stories": "like to hear stories",
    "likes to tell stories": "like to tell stories",
    "fears sharing secrets": "afraid to share secrets",
    "enjoys sharing secrets": "like to share secrets",
    "lives dangerously": "take risks",
    "thinks about things from the top down": "think from big to small",
    "reasons from the bottom up": "think from small to big",
    "has not changed much": "haven't changed much",
    "very different than before": "very different now",
    "liked school": "liked school",
    "hated school": "hated school",
    "comes up with ideas and convinces other people of them":
      "come up with ideas",
    "critically evaluates the ideas of others": "judge other ideas",
    "listens more": "listen more",
    "talks more": "talk more",
    "prefers to be first mate": "like to follow",
    "prefers to be captain": "like to lead",
    "has deep interests": "have deep interests",
    "has many interests": "have many interests",
    "people-oriented": "care about people",
    "task-oriented": "care about tasks",
    "tells others about their plans": "tell others your plans",
    "tells others about what they have done": "tell others what you did",
    "keep room door closed": "keep door closed",
    "leaves door open": "leave door open",
    "criticizes themselves": "criticize yourself",
    "accepts themselves": "accept yourself",
    "quick thinker": "think fast",
    "deep thinker": "think deep",
    "notices a person' or s physical appearance first":
      "notice how people look first",
    "hates the dentist": "hate the dentist",
    "does not mind the dentist": "don't mind the dentist",
    "works best alone": "work best alone",
    "works best in groups": "work best in groups",
  };

  // Apply replacements
  for (const [complex, simple] of Object.entries(replacements)) {
    simplified = simplified.replace(new RegExp(complex, "gi"), simple);
  }

  // Fix prompts that start with "do you" followed by an adjective - change to "are you more"
  // Do this BEFORE fixing verbs to avoid conflicts
  for (const adj of adjectives) {
    if (simplified.match(new RegExp(`^do you ${adj}\\s`, "i"))) {
      simplified = simplified.replace(
        new RegExp(`^do you ${adj}`, "i"),
        `are you more ${adj}`
      );
      break; // Only fix once
    }
  }

  // Fix prompts that start with "are you more" followed by a verb - change to "do you"
  // But only if it's not an adjective
  const isAdjective = adjectives.some((adj) => {
    const match = simplified.match(/^are you more (\w+)/i);
    return match && match[1].toLowerCase() === adj;
  });

  if (!isAdjective) {
    simplified = simplified.replace(
      /^are you more (learn|like|want|think|talk|work|have|feel|keep|tell|notice|hate|accept|criticize|come|judge|prefer|care|lead|follow|take)/,
      "do you $1"
    );
  }

  // Clean up double spaces
  simplified = simplified.replace(/\s+/g, " ").trim();

  // Capitalize first letter
  if (simplified.length > 0) {
    simplified = simplified.charAt(0).toUpperCase() + simplified.slice(1);
  }

  return simplified;
}

// Process all questions
for (const dichotomy in questions) {
  for (const question of questions[dichotomy]) {
    if (question.prompt) {
      question.prompt = simplify(question.prompt);
    }
    if (question.left) {
      question.left = simplify(question.left);
    }
    if (question.right) {
      question.right = simplify(question.right);
    }
  }
}

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf8");
console.log("Questions simplified successfully!");
