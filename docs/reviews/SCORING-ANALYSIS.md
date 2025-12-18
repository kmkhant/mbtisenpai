# MBTI Scoring Analysis: Why Negative Scores Occur

## How the Scoring System Works

The scoring formula is:

```typescript
scores[letter] += answerValue * weight;
```

Where:

- **answerValue**: -2 (strongly left), -1 (slightly left), 0 (neutral), +1 (slightly right), +2 (strongly right)
- **weight**: Always positive, represents association with the "right" option

## Why Negative Scores Happen

### Example Scenario

**Question 5**: "Deep down, are you more angry or resentful?"

- Left: "angry"
- Right: "resentful"
- Weights: `{I: 0.21, N: 0.02, J: 0.04}` (all for "right" option)

**If user chooses "angry" (left, -2):**

- I: `0 + (-2) * 0.21 = -0.42`
- N: `0 + (-2) * 0.02 = -0.04`
- J: `0 + (-2) * 0.04 = -0.08`

**If user chooses "resentful" (right, +2):**

- I: `0 + (2) * 0.21 = +0.42`
- N: `0 + (2) * 0.02 = +0.04`
- J: `0 + (2) * 0.04 = +0.08`

## Root Causes of Negative Scores

### 1. **User Preference for "Left" Options**

When users consistently choose "left" options, scores become negative because:

- Left choice = negative answerValue (-2 or -1)
- Negative × positive weight = negative score

### 2. **Question Weight Structure**

- Weights only represent the "right" option
- Choosing "left" subtracts from those weights
- If a user prefers "left" options more often, their scores go negative

### 3. **Both Scores Negative = Weak Preference**

When both scores in a dichotomy are negative (e.g., S = -0.98, N = -3.54):

- User didn't strongly prefer either side
- Answers leaned away from both traits
- This indicates a **balanced/neutral preference** rather than a strong one

## Is This Correct Behavior?

**Yes, this is mathematically correct** based on the current scoring model:

- Negative scores indicate the user is leaning **away** from those traits
- The system correctly identifies which trait is "less negative" (higher)
- Type determination still works: `scores.E >= scores.I ? "E" : "I"`

## Potential Issues

### Issue 1: Question Balance

If questions are not balanced (more "right" weighted questions than "left"), users who prefer "left" options will systematically get negative scores.

### Issue 2: Interpretation

Negative scores can be confusing because:

- They don't represent "negative traits"
- They represent "leaning away from" those traits
- When both are negative, it means weak preference overall

## Recommendations

### Option 1: Keep Current System (Recommended)

- Mathematically sound
- Already handled in UI with proper explanations
- Negative scores are valid indicators of preference strength

### Option 2: Normalize to Positive Range

Shift all scores by adding a constant to make them all positive:

- Pros: Easier to interpret
- Cons: Loses information about absolute preference strength
- Cons: May mask weak preferences

### Option 3: Adjust Weight Interpretation

If weights should represent both options:

- Need to verify original MBTI methodology
- Would require restructuring question data
- More complex implementation

## Current UI Handling

The result page now:

1. ✅ Shows raw scores with color coding (amber for negative)
2. ✅ Explains when both scores are negative
3. ✅ Provides context about what negative scores mean
4. ✅ Shows both normalized percentages and raw differences

## Conclusion

Negative scores are **expected and correct** when:

- Users prefer "left" options
- Users have weak/balanced preferences
- Questions are weighted toward "right" options

The scoring system is working as designed. The UI improvements we made help users understand what these scores mean.
