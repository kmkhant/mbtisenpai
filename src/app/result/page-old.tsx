"use client";

import { useMemo, useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TrendingUp,
  Share2,
  Check,
  Heart,
  AlertCircle,
  BarChart3,
  Target,
  Users,
  Briefcase,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Progress } from "@/components/animate-ui/components/base/progress";
import {
  ProgressIndicator,
  ProgressTrack as ProgressTrackPrimitive,
} from "@/components/animate-ui/primitives/base/progress";
import { useIsInView } from "@/hooks/use-is-in-view";
import { cn } from "@/lib/utils";

type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

type MbtiResult = {
  type: string;
  scores: Record<MbtiLetter, number>;
  percentages: Record<MbtiLetter, number>;
  warning?: string;
};

type TypeExplanation = {
  groupTitle: string;
  groupDescription: string;
  typeTitle: string;
  typeDescription: string;
};

const SENPAI_MESSAGES: Record<string, string> = {
  INTJ: "You're a mastermind plotting world domination. Senpai sees your grand plans! 🧠✨",
  INTP: "Your brain is a beautiful chaos of ideas. Senpai loves watching you think! 🤔💡",
  ENTJ: "You're a natural-born leader. Senpai respects that commanding energy! 👑⚡",
  ENTP: "You're always one step ahead with wild ideas. Senpai is impressed! 🚀🎯",
  INFJ: "You see what others miss. Senpai appreciates your deep wisdom! 🔮💫",
  INFP: "Your heart is pure gold and your dreams are beautiful. Senpai feels your vibe! 💖🌈",
  ENFJ: "You light up every room you enter. Senpai sees your magical presence! ✨🌟",
  ENFP: "Your energy is absolutely infectious. Senpai can't help but smile! 🎉💃",
  ISTJ: "You're the steady rock everyone relies on. Senpai trusts your process! 🏛️📋",
  ISFJ: "You care so deeply for others. Senpai sees your beautiful kindness! 💝🤗",
  ESTJ: "You get things done like nobody's business. Senpai admires your efficiency! ⚡📊",
  ESFJ: "You bring people together like a pro. Senpai loves your warm heart! 🎊💕",
  ISTP: "You're a hands-on problem-solver. Senpai respects your skills! 🔧🎨",
  ISFP: "You create beauty everywhere you go. Senpai sees your artistic soul! 🎨🌸",
  ESTP: "You live in the moment like a boss. Senpai loves your spontaneity! 🎲🔥",
  ESFP: "You're the life of every party. Senpai can't keep up with your energy! 🎪🎈",
};

type CompatibilityInfo = {
  energyMatches: string[];
  difficultCommunication: string[];
};

type TypeDeepAnalysis = {
  strengths: string[];
  weaknesses: string[];
  growthAreas: string[];
  workStyle: string;
  relationshipStyle: string;
  stressTriggers: string[];
  communicationTips: string[];
};

const COMPATIBILITY_DATA: Record<string, CompatibilityInfo> = {
  INTJ: {
    energyMatches: ["INTP", "ENTJ", "ENTP", "INFJ"],
    difficultCommunication: ["ESFP", "ESTP", "ESFJ", "ESTJ"],
  },
  INTP: {
    energyMatches: ["INTJ", "ENTP", "ENFP", "INFP"],
    difficultCommunication: ["ESFJ", "ESTJ", "ESFP", "ESTP"],
  },
  ENTJ: {
    energyMatches: ["INTJ", "ENTP", "ENFJ", "ESTJ"],
    difficultCommunication: ["ISFP", "ISFJ", "ISTP", "ISTJ"],
  },
  ENTP: {
    energyMatches: ["INTJ", "INTP", "ENFP", "ENTJ"],
    difficultCommunication: ["ISFJ", "ISTJ", "ISFP", "ISTP"],
  },
  INFJ: {
    energyMatches: ["INTJ", "INFP", "ENFJ", "ENFP"],
    difficultCommunication: ["ESTP", "ESTJ", "ESFP", "ESFJ"],
  },
  INFP: {
    energyMatches: ["INFJ", "ENFP", "ENFJ", "INTP"],
    difficultCommunication: ["ESTJ", "ESTP", "ESFJ", "ESFP"],
  },
  ENFJ: {
    energyMatches: ["INFJ", "INFP", "ENFP", "ENTJ"],
    difficultCommunication: ["ISTP", "ISTJ", "ISFP", "ISFJ"],
  },
  ENFP: {
    energyMatches: ["INFP", "INFJ", "ENTP", "ENFJ"],
    difficultCommunication: ["ISTJ", "ISTP", "ISFJ", "ISFP"],
  },
  ISTJ: {
    energyMatches: ["ISFJ", "ESTJ", "ESFJ", "INTJ"],
    difficultCommunication: ["ENFP", "ENTP", "ENFJ", "ENTJ"],
  },
  ISFJ: {
    energyMatches: ["ISTJ", "ESFJ", "ESTJ", "INFJ"],
    difficultCommunication: ["ENTP", "ENTJ", "ENFP", "ENFJ"],
  },
  ESTJ: {
    energyMatches: ["ISTJ", "ESFJ", "ENTJ", "ISTP"],
    difficultCommunication: ["INFP", "ISFP", "INTP", "INFJ"],
  },
  ESFJ: {
    energyMatches: ["ISFJ", "ESTJ", "ESFP", "ENFJ"],
    difficultCommunication: ["INTP", "INTJ", "ISTP", "ISTJ"],
  },
  ISTP: {
    energyMatches: ["ISFP", "ESTP", "ESFP", "ISTJ"],
    difficultCommunication: ["ENFJ", "ENFP", "ENTJ", "ENTP"],
  },
  ISFP: {
    energyMatches: ["ISTP", "ESFP", "ESTP", "INFP"],
    difficultCommunication: ["ENTJ", "ENTP", "ENFJ", "ENFP"],
  },
  ESTP: {
    energyMatches: ["ISTP", "ESFP", "ESTJ", "ENTP"],
    difficultCommunication: ["INFJ", "INFP", "ISFJ", "ISFP"],
  },
  ESFP: {
    energyMatches: ["ISFP", "ESTP", "ESFJ", "ENFP"],
    difficultCommunication: ["INTJ", "INTP", "ISTJ", "ISTP"],
  },
};

const TYPE_DEEP_ANALYSIS: Record<string, TypeDeepAnalysis> = {
  INTJ: {
    strengths: [
      "Strategic long-term planning and vision",
      "Independent problem-solving",
      "High standards and quality focus",
      "Logical and objective decision-making",
      "Ability to see patterns and connections",
    ],
    weaknesses: [
      "Can be overly critical or perfectionistic",
      "May struggle with expressing emotions",
      "Tendency to work in isolation",
      "Impatience with inefficiency",
      "Difficulty with small talk or social niceties",
    ],
    growthAreas: [
      "Sharing ideas and plans with others earlier",
      "Acknowledging and expressing feelings",
      "Being more patient with different working styles",
      "Building stronger interpersonal connections",
      "Balancing perfectionism with progress",
    ],
    workStyle:
      "Prefers working independently or in small, competent teams. Thrives with clear goals, autonomy, and opportunities to innovate. Values efficiency and strategic thinking. May struggle with micromanagement or overly social work environments.",
    relationshipStyle:
      "Values deep, meaningful connections over surface-level interactions. Shows care through actions and problem-solving rather than emotional expression. Needs space and independence. Appreciates partners who respect their need for solitude and intellectual pursuits.",
    stressTriggers: [
      "Chaos and disorganization",
      "Inefficiency and wasted time",
      "Emotional drama or conflict",
      "Lack of control or autonomy",
      "Being forced into social situations",
    ],
    communicationTips: [
      "Be direct and concise - avoid small talk",
      "Present logical arguments with evidence",
      "Respect their need for processing time",
      "Don't take their directness personally",
      "Give them space to think before responding",
    ],
  },
  INTP: {
    strengths: [
      "Creative problem-solving",
      "Intellectual curiosity and learning",
      "Flexible and adaptable thinking",
      "Objective analysis",
      "Innovation and idea generation",
    ],
    weaknesses: [
      "Difficulty finishing projects",
      "Struggles with routine and structure",
      "May seem detached or unemotional",
      "Procrastination on practical tasks",
      "Difficulty expressing feelings",
    ],
    growthAreas: [
      "Following through on commitments",
      "Developing emotional intelligence",
      "Creating systems for organization",
      "Balancing theory with action",
      "Communicating ideas more clearly",
    ],
    workStyle:
      "Thrives in environments with intellectual freedom and minimal structure. Prefers projects that allow creative problem-solving. May struggle with deadlines, routine tasks, or overly structured processes. Works best when given autonomy.",
    relationshipStyle:
      "Values intellectual connection and stimulating conversations. Shows love through sharing ideas and solving problems together. Needs space for independent thinking. May struggle with emotional expression but values deep understanding.",
    stressTriggers: [
      "Rigid schedules and deadlines",
      "Emotional pressure or drama",
      "Repetitive, routine tasks",
      "Being micromanaged",
      "Forced social interactions",
    ],
    communicationTips: [
      "Engage with their ideas and theories",
      "Give them time to process",
      "Don't pressure for emotional responses",
      "Respect their need for alone time",
      "Be patient with their thought processes",
    ],
  },
  ENTJ: {
    strengths: [
      "Natural leadership and decisiveness",
      "Strategic planning and execution",
      "High efficiency and productivity",
      "Goal-oriented and results-driven",
      "Confident and assertive communication",
    ],
    weaknesses: [
      "Can be impatient or blunt",
      "May overlook emotional needs",
      "Tendency to be controlling",
      "Difficulty with failure or setbacks",
      "May neglect work-life balance",
    ],
    growthAreas: [
      "Developing emotional intelligence",
      "Practicing patience and listening",
      "Acknowledging others' contributions",
      "Balancing work and personal life",
      "Being more flexible with plans",
    ],
    workStyle:
      "Thrives in leadership roles with clear objectives and measurable results. Prefers structured environments where they can organize and direct. Values efficiency, competence, and achievement. May struggle with ambiguity or lack of control.",
    relationshipStyle:
      "Shows love through actions, planning, and providing for others. Values partners who are independent and goal-oriented. May struggle with emotional expression but is loyal and committed. Needs respect and appreciation for their efforts.",
    stressTriggers: [
      "Inefficiency and incompetence",
      "Lack of progress or results",
      "Being micromanaged",
      "Emotional manipulation",
      "Unclear goals or direction",
    ],
    communicationTips: [
      "Be direct and get to the point",
      "Present solutions, not just problems",
      "Respect their time and efficiency",
      "Acknowledge their achievements",
      "Give them space to lead when appropriate",
    ],
  },
  ENTP: {
    strengths: [
      "Quick thinking and adaptability",
      "Innovation and creativity",
      "Excellent debate and discussion skills",
      "Enthusiasm and energy",
      "Ability to see multiple perspectives",
    ],
    weaknesses: [
      "Difficulty following through",
      "May be argumentative or challenging",
      "Struggles with routine and structure",
      "Can be insensitive to feelings",
      "Procrastination on details",
    ],
    growthAreas: [
      "Completing projects and commitments",
      "Developing emotional sensitivity",
      "Creating structure and routines",
      "Following through on plans",
      "Balancing debate with listening",
    ],
    workStyle:
      "Thrives in dynamic, fast-paced environments with variety and challenges. Prefers projects that allow creativity and problem-solving. May struggle with routine tasks, detailed work, or strict deadlines. Works best with flexibility and autonomy.",
    relationshipStyle:
      "Values intellectual stimulation and lively conversations. Shows love through engaging discussions and shared adventures. Needs freedom and variety. May struggle with emotional depth but values authentic connections. Appreciates partners who challenge them.",
    stressTriggers: [
      "Boredom and routine",
      "Being restricted or controlled",
      "Emotional pressure",
      "Repetitive tasks",
      "Lack of intellectual stimulation",
    ],
    communicationTips: [
      "Engage in debates and discussions",
      "Don't take their challenges personally",
      "Give them space for variety",
      "Be open to new ideas",
      "Respect their need for freedom",
    ],
  },
  INFJ: {
    strengths: [
      "Deep insight into people and situations",
      "Strong values and integrity",
      "Creative problem-solving",
      "Empathy and understanding",
      "Long-term vision and planning",
    ],
    weaknesses: [
      "Perfectionism and idealism",
      "Tendency to overthink",
      "Difficulty setting boundaries",
      "May neglect own needs",
      "Sensitivity to criticism",
    ],
    growthAreas: [
      "Setting and maintaining boundaries",
      "Expressing needs directly",
      "Balancing idealism with reality",
      "Taking action on ideas",
      "Protecting personal energy",
    ],
    workStyle:
      "Prefers meaningful work that aligns with values. Thrives in roles that allow helping others and creating positive change. Values autonomy and creative freedom. May struggle with conflict, bureaucracy, or superficial environments. Needs time for reflection.",
    relationshipStyle:
      "Seeks deep, authentic connections with shared values. Shows love through understanding, support, and meaningful gestures. Needs space for solitude and processing. Values partners who appreciate their depth and respect their boundaries.",
    stressTriggers: [
      "Conflict and disharmony",
      "Superficial or inauthentic interactions",
      "Being overwhelmed by others' emotions",
      "Lack of personal space",
      "Values being compromised",
    ],
    communicationTips: [
      "Be authentic and genuine",
      "Respect their need for alone time",
      "Listen to their insights",
      "Don't pressure for quick decisions",
      "Appreciate their depth and thoughtfulness",
    ],
  },
  INFP: {
    strengths: [
      "Creativity and imagination",
      "Strong personal values",
      "Empathy and understanding",
      "Open-mindedness",
      "Authenticity and genuineness",
    ],
    weaknesses: [
      "Self-doubt and perfectionism",
      "Difficulty with conflict",
      "Procrastination on practical tasks",
      "Tendency to idealize",
      "Sensitivity to criticism",
    ],
    growthAreas: [
      "Building self-confidence",
      "Handling conflict constructively",
      "Creating practical structure",
      "Taking action on values",
      "Setting realistic expectations",
    ],
    workStyle:
      "Thrives in creative, flexible environments that align with personal values. Prefers autonomy and meaningful work. May struggle with strict structure, conflict, or environments that feel inauthentic. Needs time for creative expression.",
    relationshipStyle:
      "Values deep, authentic connections based on shared values. Shows love through understanding, support, and creative expressions. Needs space for personal growth and reflection. Appreciates partners who respect their individuality and values.",
    stressTriggers: [
      "Conflict and criticism",
      "Inauthentic or superficial environments",
      "Being forced into rigid structures",
      "Values being compromised",
      "Feeling misunderstood",
    ],
    communicationTips: [
      "Be genuine and authentic",
      "Respect their values and beliefs",
      "Give them space to process",
      "Avoid harsh criticism",
      "Appreciate their creativity and uniqueness",
    ],
  },
  ENFJ: {
    strengths: [
      "Natural leadership and charisma",
      "Empathy and understanding",
      "Excellent communication skills",
      "Ability to inspire others",
      "Organizational and planning skills",
    ],
    weaknesses: [
      "Tendency to overextend",
      "Difficulty saying no",
      "May neglect own needs",
      "Sensitivity to criticism",
      "Can be controlling",
    ],
    growthAreas: [
      "Setting boundaries and saying no",
      "Prioritizing self-care",
      "Accepting imperfection",
      "Delegating and trusting others",
      "Balancing giving with receiving",
    ],
    workStyle:
      "Thrives in people-oriented roles that allow helping and inspiring others. Prefers collaborative environments with clear goals. Values harmony and positive relationships. May struggle with conflict, criticism, or environments that feel disconnected.",
    relationshipStyle:
      "Shows love through care, support, and helping partners grow. Values deep, meaningful connections. May overextend in relationships. Needs appreciation and reciprocation. Appreciates partners who value their efforts and support their goals.",
    stressTriggers: [
      "Conflict and disharmony",
      "Feeling unappreciated",
      "Being overwhelmed by others' needs",
      "Lack of positive feedback",
      "Inability to help or fix problems",
    ],
    communicationTips: [
      "Show appreciation and gratitude",
      "Respect their need to help",
      "Give them positive feedback",
      "Be open about your needs",
      "Support their goals and dreams",
    ],
  },
  ENFP: {
    strengths: [
      "Enthusiasm and energy",
      "Creativity and innovation",
      "Excellent communication skills",
      "Empathy and understanding",
      "Ability to inspire others",
    ],
    weaknesses: [
      "Difficulty with routine and structure",
      "Tendency to procrastinate",
      "May struggle with follow-through",
      "Sensitivity to criticism",
      "Can be disorganized",
    ],
    growthAreas: [
      "Creating structure and routines",
      "Following through on commitments",
      "Managing time and priorities",
      "Handling criticism constructively",
      "Balancing enthusiasm with focus",
    ],
    workStyle:
      "Thrives in creative, dynamic environments with variety and people interaction. Prefers flexibility and autonomy. Values meaningful work and positive relationships. May struggle with routine, structure, or environments that feel restrictive.",
    relationshipStyle:
      "Shows love through enthusiasm, support, and shared adventures. Values deep, authentic connections with emotional intimacy. Needs freedom and variety. Appreciates partners who share their enthusiasm and respect their need for space.",
    stressTriggers: [
      "Routine and monotony",
      "Being restricted or controlled",
      "Harsh criticism",
      "Conflict and negativity",
      "Lack of variety or stimulation",
    ],
    communicationTips: [
      "Share their enthusiasm",
      "Respect their need for freedom",
      "Be positive and supportive",
      "Give constructive feedback gently",
      "Appreciate their creativity and energy",
    ],
  },
  ISTJ: {
    strengths: [
      "Reliability and responsibility",
      "Attention to detail",
      "Strong organizational skills",
      "Practical problem-solving",
      "Loyalty and commitment",
    ],
    weaknesses: [
      "Resistance to change",
      "Can be inflexible",
      "Difficulty with abstract concepts",
      "May seem unemotional",
      "Tendency to be overly critical",
    ],
    growthAreas: [
      "Embracing change and flexibility",
      "Developing creativity",
      "Expressing emotions",
      "Being more open to new ideas",
      "Balancing structure with spontaneity",
    ],
    workStyle:
      "Thrives in structured, organized environments with clear procedures. Prefers stability and predictability. Values competence, reliability, and quality. May struggle with change, ambiguity, or environments that lack structure.",
    relationshipStyle:
      "Shows love through reliability, practical support, and commitment. Values stability and loyalty. May struggle with emotional expression but is deeply loyal. Needs respect for their need for structure and routine.",
    stressTriggers: [
      "Sudden changes or chaos",
      "Unreliability or incompetence",
      "Lack of structure or planning",
      "Emotional drama",
      "Being forced into spontaneity",
    ],
    communicationTips: [
      "Be reliable and follow through",
      "Respect their need for structure",
      "Give them time to process changes",
      "Appreciate their practical contributions",
      "Be direct and clear in communication",
    ],
  },
  ISFJ: {
    strengths: [
      "Caring and supportive",
      "Reliability and responsibility",
      "Attention to detail",
      "Strong memory and observation",
      "Loyalty and commitment",
    ],
    weaknesses: [
      "Tendency to overextend",
      "Difficulty saying no",
      "Resistance to change",
      "May neglect own needs",
      "Sensitivity to criticism",
    ],
    growthAreas: [
      "Setting boundaries",
      "Prioritizing self-care",
      "Embracing change",
      "Expressing own needs",
      "Building self-confidence",
    ],
    workStyle:
      "Thrives in supportive, structured environments where they can help others. Prefers clear expectations and stable routines. Values harmony and positive relationships. May struggle with conflict, change, or environments that lack appreciation.",
    relationshipStyle:
      "Shows love through care, support, and thoughtful gestures. Values stability, loyalty, and commitment. May overextend in relationships. Needs appreciation and reciprocation. Appreciates partners who value their efforts and show gratitude.",
    stressTriggers: [
      "Conflict and criticism",
      "Feeling unappreciated",
      "Sudden changes",
      "Being overwhelmed by others' needs",
      "Lack of structure or routine",
    ],
    communicationTips: [
      "Show appreciation and gratitude",
      "Respect their need for routine",
      "Be gentle with criticism",
      "Acknowledge their contributions",
      "Support their need for stability",
    ],
  },
  ESTJ: {
    strengths: [
      "Natural leadership",
      "Organizational skills",
      "Efficiency and productivity",
      "Practical problem-solving",
      "Reliability and commitment",
    ],
    weaknesses: [
      "Can be inflexible or controlling",
      "May seem unemotional",
      "Difficulty with abstract concepts",
      "Tendency to be blunt",
      "Resistance to change",
    ],
    growthAreas: [
      "Developing flexibility",
      "Expressing emotions",
      "Being more patient",
      "Embracing new ideas",
      "Balancing control with trust",
    ],
    workStyle:
      "Thrives in structured, organized environments with clear hierarchies. Prefers leadership roles with measurable results. Values efficiency, competence, and tradition. May struggle with ambiguity, change, or environments that lack structure.",
    relationshipStyle:
      "Shows love through practical support, planning, and providing for others. Values stability, loyalty, and commitment. May struggle with emotional expression but is deeply committed. Needs respect for their need for structure and efficiency.",
    stressTriggers: [
      "Inefficiency and chaos",
      "Unreliability or incompetence",
      "Lack of structure",
      "Being challenged or undermined",
      "Emotional drama",
    ],
    communicationTips: [
      "Be direct and efficient",
      "Respect their need for structure",
      "Appreciate their leadership",
      "Be reliable and follow through",
      "Give them space to organize",
    ],
  },
  ESFJ: {
    strengths: [
      "Caring and supportive",
      "Excellent organizational skills",
      "Strong social skills",
      "Reliability and responsibility",
      "Ability to create harmony",
    ],
    weaknesses: [
      "Tendency to overextend",
      "Difficulty with conflict",
      "Sensitivity to criticism",
      "May neglect own needs",
      "Resistance to change",
    ],
    growthAreas: [
      "Setting boundaries",
      "Prioritizing self-care",
      "Handling conflict constructively",
      "Embracing change",
      "Building self-confidence",
    ],
    workStyle:
      "Thrives in people-oriented, structured environments where they can help and organize. Prefers collaborative settings with clear expectations. Values harmony, tradition, and positive relationships. May struggle with conflict, change, or environments that lack appreciation.",
    relationshipStyle:
      "Shows love through care, support, and creating harmony. Values stability, loyalty, and social connections. May overextend in relationships. Needs appreciation and reciprocation. Appreciates partners who value their efforts and participate in social activities.",
    stressTriggers: [
      "Conflict and criticism",
      "Feeling unappreciated",
      "Sudden changes",
      "Being overwhelmed by others' needs",
      "Lack of social connection",
    ],
    communicationTips: [
      "Show appreciation and gratitude",
      "Respect their need for harmony",
      "Be gentle with criticism",
      "Participate in social activities",
      "Acknowledge their contributions",
    ],
  },
  ISTP: {
    strengths: [
      "Practical problem-solving",
      "Hands-on skills",
      "Calm under pressure",
      "Independence",
      "Logical analysis",
    ],
    weaknesses: [
      "Difficulty expressing emotions",
      "Tendency to be detached",
      "May seem uncommitted",
      "Difficulty with long-term planning",
      "Resistance to emotional discussions",
    ],
    growthAreas: [
      "Expressing emotions",
      "Long-term planning",
      "Building emotional connections",
      "Following through on commitments",
      "Communicating feelings",
    ],
    workStyle:
      "Thrives in hands-on, technical environments with autonomy. Prefers projects that allow problem-solving and practical application. Values competence and efficiency. May struggle with routine, emotional discussions, or environments that lack autonomy.",
    relationshipStyle:
      "Shows love through actions and practical support rather than words. Values independence and space. May struggle with emotional expression but is loyal. Needs partners who respect their need for autonomy and don't pressure for emotional discussions.",
    stressTriggers: [
      "Emotional pressure",
      "Being controlled or restricted",
      "Routine and monotony",
      "Long-term commitments",
      "Forced social interactions",
    ],
    communicationTips: [
      "Respect their need for space",
      "Don't pressure for emotional responses",
      "Appreciate their practical contributions",
      "Give them time to process",
      "Be direct and concise",
    ],
  },
  ISFP: {
    strengths: [
      "Creativity and artistic ability",
      "Empathy and understanding",
      "Flexibility and adaptability",
      "Authenticity",
      "Appreciation for beauty",
    ],
    weaknesses: [
      "Difficulty with conflict",
      "Tendency to avoid planning",
      "Sensitivity to criticism",
      "May struggle with structure",
      "Difficulty expressing needs",
    ],
    growthAreas: [
      "Handling conflict constructively",
      "Creating structure when needed",
      "Expressing needs directly",
      "Building self-confidence",
      "Following through on commitments",
    ],
    workStyle:
      "Thrives in creative, flexible environments that allow self-expression. Prefers autonomy and variety. Values authenticity and personal values. May struggle with strict structure, conflict, or environments that feel restrictive or inauthentic.",
    relationshipStyle:
      "Shows love through thoughtful gestures, creativity, and understanding. Values authenticity, freedom, and deep connections. Needs space for personal expression. Appreciates partners who respect their individuality and support their creative pursuits.",
    stressTriggers: [
      "Conflict and criticism",
      "Being controlled or restricted",
      "Inauthentic environments",
      "Rigid structure",
      "Feeling misunderstood",
    ],
    communicationTips: [
      "Be genuine and authentic",
      "Respect their need for freedom",
      "Appreciate their creativity",
      "Avoid harsh criticism",
      "Give them space for self-expression",
    ],
  },
  ESTP: {
    strengths: [
      "Quick thinking and adaptability",
      "Practical problem-solving",
      "Confidence and assertiveness",
      "Ability to read situations",
      "Action-oriented",
    ],
    weaknesses: [
      "Tendency to be impulsive",
      "Difficulty with long-term planning",
      "May seem insensitive",
      "Resistance to routine",
      "Difficulty with emotional depth",
    ],
    growthAreas: [
      "Long-term planning",
      "Developing emotional intelligence",
      "Following through on commitments",
      "Considering consequences",
      "Building deeper connections",
    ],
    workStyle:
      "Thrives in fast-paced, dynamic environments with variety and action. Prefers hands-on, practical work with immediate results. Values competence and efficiency. May struggle with routine, planning, or environments that lack excitement or variety.",
    relationshipStyle:
      "Shows love through actions, adventures, and practical support. Values freedom, excitement, and shared experiences. May struggle with emotional depth but is loyal and fun. Needs partners who share their enthusiasm and respect their need for space.",
    stressTriggers: [
      "Routine and monotony",
      "Being restricted or controlled",
      "Emotional pressure",
      "Long-term planning",
      "Lack of variety or excitement",
    ],
    communicationTips: [
      "Be direct and action-oriented",
      "Respect their need for freedom",
      "Share their enthusiasm",
      "Don't pressure for emotional depth",
      "Appreciate their practical contributions",
    ],
  },
  ESFP: {
    strengths: [
      "Enthusiasm and energy",
      "Social skills and charisma",
      "Flexibility and adaptability",
      "Optimism and positivity",
      "Ability to live in the moment",
    ],
    weaknesses: [
      "Difficulty with routine and structure",
      "Tendency to avoid planning",
      "May struggle with long-term commitments",
      "Sensitivity to criticism",
      "Difficulty with conflict",
    ],
    growthAreas: [
      "Creating structure when needed",
      "Long-term planning",
      "Handling conflict constructively",
      "Following through on commitments",
      "Balancing fun with responsibility",
    ],
    workStyle:
      "Thrives in people-oriented, dynamic environments with variety and social interaction. Prefers flexible, creative work with positive relationships. Values fun, authenticity, and shared experiences. May struggle with routine, structure, or environments that feel restrictive or negative.",
    relationshipStyle:
      "Shows love through enthusiasm, fun, and shared experiences. Values authenticity, freedom, and positive connections. Needs space for variety and spontaneity. Appreciates partners who share their enthusiasm and respect their need for freedom.",
    stressTriggers: [
      "Routine and monotony",
      "Conflict and negativity",
      "Being controlled or restricted",
      "Harsh criticism",
      "Lack of social connection",
    ],
    communicationTips: [
      "Be positive and enthusiastic",
      "Respect their need for freedom",
      "Share their fun and energy",
      "Avoid harsh criticism",
      "Appreciate their social contributions",
    ],
  },
};

const TYPE_EXPLANATIONS: Record<string, TypeExplanation> = {
  // Analysts – Intuitive & Thinking
  INTJ: {
    groupTitle: "The Analysts (Intuitive & Thinking)",
    groupDescription:
      "These types are known for their rationality, intellectual excellence, and love for problem-solving.",
    typeTitle: "The Architect",
    typeDescription:
      "Strategic, imaginative, and independent thinkers who naturally look for patterns behind the chaos. INTJs like having a long-term vision and carefully designed systems, and they often prefer working alone or with a small circle of competent people. They may need to remember to share their inner plans with others and soften a tendency toward perfectionism or excessive criticism.",
  },
  INTP: {
    groupTitle: "The Analysts (Intuitive & Thinking)",
    groupDescription:
      "These types are known for their rationality, intellectual excellence, and love for problem-solving.",
    typeTitle: "The Logician",
    typeDescription:
      "Innovative, curious problem-solvers who love taking ideas apart and rebuilding them into elegant theories. INTPs are energized by questions, patterns, and abstract models more than by practical details or routines. They may struggle with finishing projects, communicating clearly in emotional situations, or turning their many ideas into consistent action.",
  },
  ENTJ: {
    groupTitle: "The Analysts (Intuitive & Thinking)",
    groupDescription:
      "These types are known for their rationality, intellectual excellence, and love for problem-solving.",
    typeTitle: "The Commander",
    typeDescription:
      "Decisive, goal-focused leaders who are quick to take charge and organize people and resources. ENTJs think in terms of efficiency, long‑term strategy, and measurable results, and they often feel most alive when fixing broken systems. They may come across as blunt or impatient, so learning to slow down, listen, and show appreciation helps balance their intensity.",
  },
  ENTP: {
    groupTitle: "The Analysts (Intuitive & Thinking)",
    groupDescription:
      "These types are known for their rationality, intellectual excellence, and love for problem-solving.",
    typeTitle: "The Debater",
    typeDescription:
      'Quick-witted, idea-driven explorers who love to challenge assumptions and play "devil\'s advocate." ENTPs enjoy debate, brainstorming, and discovering new angles more than settling on one fixed path. They may need to watch out for starting too many things at once, dismissing feelings as irrational, or getting bored with necessary follow‑through.',
  },

  // Diplomats – Intuitive & Feeling
  INFJ: {
    groupTitle: "The Diplomats (Intuitive & Feeling)",
    groupDescription:
      "These types focus on empathy, personal growth, and creating harmony in the world.",
    typeTitle: "The Advocate",
    typeDescription:
      "Quietly insightful idealists who look for deeper patterns in people and society. INFJs are drawn to meaningful work, authentic relationships, and causes that align with their values, often serving as guides or confidants to others. They may need to protect their energy, set clearer boundaries, and share their needs instead of silently carrying everyone else’s burdens.",
  },
  INFP: {
    groupTitle: "The Diplomats (Intuitive & Feeling)",
    groupDescription:
      "These types focus on empathy, personal growth, and creating harmony in the world.",
    typeTitle: "The Mediator",
    typeDescription:
      "Imaginative, values-driven individuals who filter life through a rich inner world of meaning and emotion. INFPs care deeply about authenticity, fairness, and living in alignment with what feels morally right to them. They may struggle with self‑doubt, conflict, and practical structure, so turning ideals into small, concrete steps is especially helpful.",
  },
  ENFJ: {
    groupTitle: "The Diplomats (Intuitive & Feeling)",
    groupDescription:
      "These types focus on empathy, personal growth, and creating harmony in the world.",
    typeTitle: "The Protagonist",
    typeDescription:
      "Warm, expressive leaders who naturally tune into what people need and how to bring them together. ENFJs often see potential in others before they see it in themselves and enjoy mentoring, guiding, and coordinating group efforts. They may overextend themselves or neglect their own needs, so learning to say no and check in with their personal values is important.",
  },
  ENFP: {
    groupTitle: "The Diplomats (Intuitive & Feeling)",
    groupDescription:
      "These types focus on empathy, personal growth, and creating harmony in the world.",
    typeTitle: "The Campaigner",
    typeDescription:
      "Enthusiastic, people‑oriented explorers who are energized by ideas, possibilities, and meaningful conversations. ENFPs often connect quickly with others, spotting unique strengths and weaving stories about what could be. They may find it hard to follow rigid routines, finish every project they start, or tolerate environments that feel shallow or controlling.",
  },

  // Sentinels – Sensing & Judging
  ISTJ: {
    groupTitle: "The Sentinels (Sensing & Judging)",
    groupDescription:
      "These types value tradition, order, and stability. They are the backbone of organizations and families.",
    typeTitle: "The Logistician",
    typeDescription:
      "Practical, thorough, and responsible individuals who take commitments seriously and notice the details others miss. ISTJs prefer clear rules, tested methods, and realistic plans, often becoming the steady anchor in work and family life. They may need to stay open to new perspectives and avoid being too hard on themselves or others when things deviate from the plan.",
  },
  ISFJ: {
    groupTitle: "The Sentinels (Sensing & Judging)",
    groupDescription:
      "These types value tradition, order, and stability. They are the backbone of organizations and families.",
    typeTitle: "The Defender",
    typeDescription:
      "Gentle, observant caretakers who notice what people need and quietly step in to help. ISFJs value loyalty, stability, and a sense of duty, often putting significant effort into creating comfort and security for others. They may forget their own needs, avoid conflict, or resist change until they feel fully prepared.",
  },
  ESTJ: {
    groupTitle: "The Sentinels (Sensing & Judging)",
    groupDescription:
      "These types value tradition, order, and stability. They are the backbone of organizations and families.",
    typeTitle: "The Executive",
    typeDescription:
      "Efficient, results‑oriented organizers who like to take charge and make sure things get done correctly and on time. ESTJs are comfortable with clear structure, measurable goals, and direct communication, especially when coordinating people or processes. They may need to soften a tendency toward bluntness and remember that not everyone moves at the same pace.",
  },
  ESFJ: {
    groupTitle: "The Sentinels (Sensing & Judging)",
    groupDescription:
      "These types value tradition, order, and stability. They are the backbone of organizations and families.",
    typeTitle: "The Consul",
    typeDescription:
      "Warm, sociable supporters who enjoy being at the center of a healthy, connected community. ESFJs pay close attention to how people are feeling and often step into roles that involve organizing, hosting, or caretaking. They may be sensitive to criticism or tension and benefit from spaces where they can process their own emotions, not just everyone else's.",
  },

  // Explorers – Sensing & Perceiving
  ISTP: {
    groupTitle: "The Explorers (Sensing & Perceiving)",
    groupDescription:
      "These types are known for their spontaneity, hands-on skills, and ability to react quickly to the present moment.",
    typeTitle: "The Virtuoso",
    typeDescription:
      "Independent, hands‑on problem‑solvers who like to figure out how things work by experimenting. ISTPs stay calm under pressure, often excelling in situations that require quick thinking and practical skill. They may find planning, emotional conversations, or long‑term commitments draining if those areas feel too restrictive or theoretical.",
  },
  ISFP: {
    groupTitle: "The Explorers (Sensing & Perceiving)",
    groupDescription:
      "These types are known for their spontaneity, hands-on skills, and ability to react quickly to the present moment.",
    typeTitle: "The Adventurer",
    typeDescription:
      "Gentle, present‑focused creators who often express themselves through aesthetics, experiences, or quiet acts of kindness. ISFPs value personal freedom, authenticity, and living in a way that feels true to who they are in the moment. They may avoid conflict or rigid structure, so it helps to create simple routines that still leave room for spontaneity.",
  },
  ESTP: {
    groupTitle: "The Explorers (Sensing & Perceiving)",
    groupDescription:
      "These types are known for their spontaneity, hands-on skills, and ability to react quickly to the present moment.",
    typeTitle: "The Entrepreneur",
    typeDescription:
      "Energetic, action‑oriented doers who prefer to learn by jumping in rather than over‑planning. ESTPs are quick to notice opportunities, read the room, and respond in real time, which makes them effective in fast‑moving environments. They may need to watch out for impulsiveness, risk‑taking without reflection, or boredom with long‑term commitments.",
  },
  ESFP: {
    groupTitle: "The Explorers (Sensing & Perceiving)",
    groupDescription:
      "These types are known for their spontaneity, hands-on skills, and ability to react quickly to the present moment.",
    typeTitle: "The Entertainer",
    typeDescription:
      "Playful, expressive personalities who bring color, warmth, and excitement into whatever space they enter. ESFPs enjoy shared experiences, sensory pleasure, and making the moment enjoyable for themselves and others. They may resist strict structure or heavy topics for too long, so it helps to build supportive routines that still allow room for fun and flexibility.",
  },
};

const fallbackChartData = [
  { dimension: "E", score: 50 },
  { dimension: "I", score: 50 },
  { dimension: "S", score: 50 },
  { dimension: "N", score: 50 },
  { dimension: "T", score: 50 },
  { dimension: "F", score: 50 },
  { dimension: "J", score: 50 },
  { dimension: "P", score: 50 },
];

const chartConfig = {
  score: {
    label: "Preference strength",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Helper functions to encode/decode result in URL
function encodeResult(result: MbtiResult): string {
  try {
    const json = JSON.stringify(result);
    return btoa(encodeURIComponent(json));
  } catch {
    return "";
  }
}

function decodeResult(encoded: string): MbtiResult | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json) as MbtiResult;
    // Validate result structure
    if (
      !parsed.type ||
      !parsed.scores ||
      !parsed.percentages ||
      typeof parsed.type !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// Component for animated progress bar with intersection observer
function AnimatedProgressBar({
  label,
  value,
  rawScore,
  isDominant,
}: {
  label: string;
  value: number;
  rawScore: number;
  isDominant: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, isInView } = useIsInView<HTMLDivElement>(containerRef, {
    inViewOnce: true,
    inViewMargin: "-100px",
  });
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (isInView && progressValue === 0) {
      // Small delay to ensure component is mounted and visible before animating
      const timer = setTimeout(() => {
        setProgressValue(value);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, progressValue]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-zinc-700">{label}</span>
        <span
          className={`text-xs font-mono font-semibold ${
            rawScore < 0
              ? "text-amber-600"
              : rawScore > 0
              ? "text-green-600"
              : "text-zinc-600"
          }`}
        >
          {rawScore > 0 ? "+" : ""}
          {rawScore.toFixed(2)}
        </span>
      </div>
      <Progress value={progressValue} className="w-full">
        <ProgressTrackPrimitive
          className={cn(
            "bg-zinc-200 relative h-2 w-full overflow-hidden rounded-full"
          )}
        >
          <ProgressIndicator
            className={`h-2 rounded-full ${
              isDominant
                ? "bg-linear-to-r from-fuchsia-500 to-pink-600"
                : "bg-zinc-300"
            }`}
          />
        </ProgressTrackPrimitive>
      </Progress>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{value}% (normalized)</span>
      </div>
    </div>
  );
}

// Component for the Detailed Score Analysis section
function DetailedScoreAnalysisSection({
  rawScoreAnalysis,
}: {
  rawScoreAnalysis: Array<{
    title: string;
    pair: [MbtiLetter, MbtiLetter];
    dominant: MbtiLetter;
    dominantLabel: string;
    aScore: number;
    bScore: number;
    aNormalized: number;
    bNormalized: number;
    difference: number;
    normalizedDiff: number;
    strength: "very-strong" | "strong" | "moderate" | "slight" | "balanced";
    strengthLabel: string;
    strengthDescription: string;
    comparisonDescription: string;
  }>;
}) {
  const strengthColors = {
    "very-strong": "bg-red-100 text-red-800 border-red-200",
    strong: "bg-orange-100 text-orange-800 border-orange-200",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    slight: "bg-blue-100 text-blue-800 border-blue-200",
    balanced: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const labelMap: Record<MbtiLetter, string> = {
    E: "Extraversion",
    I: "Introversion",
    S: "Sensing",
    N: "Intuition",
    T: "Thinking",
    F: "Feeling",
    J: "Judging",
    P: "Perceiving",
  };

  return (
    <section className="mt-8 space-y-4 text-xs text-zinc-600 sm:text-sm">
      <p className="font-semibold capitalize text-pink-500 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Detailed Score Analysis
      </p>
      <p className="text-xs text-zinc-500 sm:text-sm">
        A breakdown of your raw scores and preference strength for each
        dimension.
      </p>
      <div className="space-y-4">
        {rawScoreAnalysis.map((analysis, idx) => {
          const [a, b] = analysis.pair;

          return (
            <Card key={idx} className="bg-zinc-50/60 border-zinc-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base text-zinc-900">
                  {analysis.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Result: {analysis.dominantLabel} (
                  {analysis.dominant === analysis.pair[0]
                    ? analysis.aNormalized
                    : analysis.bNormalized}
                  %)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <AnimatedProgressBar
                      label={labelMap[a]}
                      value={analysis.aNormalized}
                      rawScore={analysis.aScore}
                      isDominant={analysis.dominant === a}
                    />
                    <AnimatedProgressBar
                      label={labelMap[b]}
                      value={analysis.bNormalized}
                      rawScore={analysis.bScore}
                      isDominant={analysis.dominant === b}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-200">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        strengthColors[analysis.strength]
                      }`}
                    >
                      {analysis.strengthLabel} Preference
                    </span>
                    <span className="text-xs text-zinc-500">
                      Difference: {analysis.normalizedDiff}%
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 sm:text-sm mb-2">
                    {analysis.strengthDescription}
                  </p>
                  <p className="text-xs text-zinc-500 italic">
                    {analysis.comparisonDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function ResultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  // Initialize state to null to ensure server/client match
  const [result, setResult] = useState<MbtiResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from URL params or sessionStorage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    let loadedResult: MbtiResult | null = null;

    // First, try to load from URL params
    const urlData = searchParams.get("data");
    if (urlData) {
      const decoded = decodeResult(urlData);
      if (decoded) {
        loadedResult = decoded;
        // Store in sessionStorage for consistency
        window.sessionStorage.setItem("mbtiResult", JSON.stringify(decoded));
      }
    }

    // If not in URL, try sessionStorage
    if (!loadedResult) {
      const stored = window.sessionStorage.getItem("mbtiResult");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as MbtiResult;
          // Validate result structure
          if (
            parsed.type &&
            parsed.scores &&
            parsed.percentages &&
            typeof parsed.type === "string"
          ) {
            loadedResult = parsed;
            // Update URL with encoded result
            const encoded = encodeResult(loadedResult);
            if (encoded) {
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.set("data", encoded);
              router.replace(newUrl.pathname + newUrl.search, {
                scroll: false,
              });
            }
          } else {
            // Invalid structure - clear
            window.sessionStorage.removeItem("mbtiResult");
          }
        } catch {
          // Invalid JSON - clear
          window.sessionStorage.removeItem("mbtiResult");
        }
      }
    }

    setResult(loadedResult);
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Function to copy shareable URL to clipboard
  const handleShare = async () => {
    if (!result) return;

    try {
      const encoded = encodeResult(result);
      if (!encoded) return;

      const shareUrl = `${window.location.origin}/result?data=${encoded}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const encoded = encodeResult(result);
      if (encoded) {
        const shareUrl = `${window.location.origin}/result?data=${encoded}`;
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Failed to copy
        }
        document.body.removeChild(textArea);
      }
    }
  };

  // Update Open Graph metadata when result is available (only after hydration)
  useEffect(() => {
    if (!result || !isHydrated || typeof window === "undefined") return;

    const type = result.type === "XXXX" ? "Unable to Determine" : result.type;
    const typeTitle =
      TYPE_EXPLANATIONS[result.type]?.typeTitle || "MBTI Result";
    const description =
      TYPE_EXPLANATIONS[result.type]?.typeDescription?.substring(0, 160) +
        "..." ||
      `Your MBTI type is ${type}. Discover your personality insights.`;

    const encoded = encodeResult(result);
    if (!encoded) return;

    const ogImageUrl = `${
      window.location.origin
    }/api/og/result?data=${encodeURIComponent(encoded)}`;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateNameTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Update title
    document.title = `${type} - ${typeTitle} | MBTI Senpai`;

    // Open Graph tags
    updateMetaTag("og:title", `${type} - ${typeTitle}`);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", ogImageUrl);
    updateMetaTag("og:type", "website");
    updateMetaTag("og:url", window.location.href);

    // Twitter Card tags
    updateNameTag("twitter:card", "summary_large_image");
    updateNameTag("twitter:title", `${type} - ${typeTitle}`);
    updateNameTag("twitter:description", description);
    updateNameTag("twitter:image", ogImageUrl);

    // Description meta tag
    updateNameTag("description", description);
  }, [result, isHydrated]);

  // Handle invalid type "XXXX" (all neutral answers)
  const mbtiType =
    result?.type === "XXXX"
      ? "Unable to Determine"
      : result?.type ?? "Your MBTI Type";

  // Use percentages directly from API instead of recalculating
  // This ensures consistency with the API's normalization logic
  const derivedPercentages = useMemo(
    () => (result ? result.percentages : null),
    [result]
  );

  // Normalize raw scores to 0-100 range for radar chart
  // Maps scores directly: min is 0, max maps to 100, others proportionally
  // This avoids showing 0 for the minimum score unless it's actually 0
  const normalizedScores = useMemo(() => {
    if (!result?.scores) return null;

    const scores = result.scores;
    const allValues = Object.values(scores);
    const maxScore = Math.max(...allValues);

    // If max is 0 or all scores are 0, return 50 for all (neutral)
    if (maxScore === 0) {
      return {
        E: 50,
        I: 50,
        S: 50,
        N: 50,
        T: 50,
        F: 50,
        J: 50,
        P: 50,
      };
    }

    // Normalize to 0-100 range based on max
    // Formula: (value / max) * 100
    // This ensures max maps to 100, and only actual 0 scores map to 0
    const normalized: Record<MbtiLetter, number> = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    for (const letter of Object.keys(normalized) as MbtiLetter[]) {
      // Normalize: (value / max) * 100
      // This maps max to 100, and only actual 0 values to 0
      normalized[letter] = Math.round((scores[letter] / maxScore) * 100);
    }

    return normalized;
  }, [result]);

  const chartData = useMemo(
    () =>
      result && normalizedScores
        ? ([
            {
              dimension: "E",
              score: normalizedScores.E,
              rawScore: result.scores.E,
            },
            {
              dimension: "I",
              score: normalizedScores.I,
              rawScore: result.scores.I,
            },
            {
              dimension: "S",
              score: normalizedScores.S,
              rawScore: result.scores.S,
            },
            {
              dimension: "N",
              score: normalizedScores.N,
              rawScore: result.scores.N,
            },
            {
              dimension: "T",
              score: normalizedScores.T,
              rawScore: result.scores.T,
            },
            {
              dimension: "F",
              score: normalizedScores.F,
              rawScore: result.scores.F,
            },
            {
              dimension: "J",
              score: normalizedScores.J,
              rawScore: result.scores.J,
            },
            {
              dimension: "P",
              score: normalizedScores.P,
              rawScore: result.scores.P,
            },
          ] as { dimension: MbtiLetter; score: number; rawScore: number }[])
        : fallbackChartData,
    [result, normalizedScores]
  );

  const strongestPreference = useMemo(() => {
    if (!result || !result.scores)
      return {
        label: "Complete the test to see your strongest preference.",
        letter: null,
        description: null,
      };

    const entries = Object.entries(result.scores) as [MbtiLetter, number][];
    const [topLetter] = entries.reduce(
      (max, current) => (current[1] > max[1] ? current : max),
      entries[0]
    );

    const labelMap: Record<MbtiLetter, string> = {
      E: "Extraversion",
      I: "Introversion",
      S: "Sensing",
      N: "Intuition",
      T: "Thinking",
      F: "Feeling",
      J: "Judging",
      P: "Perceiving",
    };

    const descriptionMap: Record<MbtiLetter, string> = {
      E: "You tend to recharge through social interaction and external stimulation, feeling energized by being around others and engaging with the world around you.",
      I: "You tend to recharge through solitude and introspection, feeling energized by quiet time alone to reflect and process your thoughts.",
      S: "You focus on concrete facts, present realities, and practical details, preferring information that is tangible and observable.",
      N: "You focus on patterns, possibilities, and abstract concepts, preferring to see the big picture and explore what could be.",
      T: "You make decisions based on logic, objectivity, and consistency, prioritizing fairness and rational analysis over personal values.",
      F: "You make decisions based on values, empathy, and personal impact, prioritizing harmony and the effect on people over pure logic.",
      J: "You prefer structure, planning, and closure, feeling more comfortable when decisions are made and things are organized.",
      P: "You prefer flexibility, spontaneity, and keeping options open, feeling more comfortable adapting to situations as they unfold.",
    };

    return {
      label: `Your strongest preference is toward ${labelMap[topLetter]}.`,
      letter: topLetter,
      description: descriptionMap[topLetter],
    };
  }, [result]);

  const strongestPreferenceLabel = strongestPreference.label;

  const dimensionNarratives = useMemo(() => {
    if (!derivedPercentages) return [];

    type DimensionNarrative = {
      key: string;
      title: string;
      summary: string;
    };

    const describeAxis = (
      a: MbtiLetter,
      b: MbtiLetter,
      title: string
    ): DimensionNarrative => {
      const aScore = derivedPercentages[a];
      const bScore = derivedPercentages[b];
      const dominant = aScore >= bScore ? a : b;

      if (a === "E" && b === "I") {
        if (dominant === "E") {
          return {
            key: "EI",
            title,
            summary: `You lean about toward Extraversion. You’re more likely to recharge through interaction, shared experiences and outer stimulation, but still have an Introverted side that sometimes needs quiet time to reset.`,
          };
        }
        return {
          key: "EI",
          title,
          summary: `You lean about toward Introversion. You likely recharge through solitude, reflection and a small circle of close connections, while still being able to step into more social, outgoing modes when needed.`,
        };
      }

      if (a === "S" && b === "N") {
        if (dominant === "S") {
          return {
            key: "SN",
            title,
            summary: `You lean about toward Sensing. You tend to notice concrete facts, current realities and practical details first, adding intuition and imagination as a secondary layer when it’s useful.`,
          };
        }
        return {
          key: "SN",
          title,
          summary: `You lean about toward Intuition. You’re more drawn to patterns, possibilities and the “big picture,” filling in details as needed rather than starting from them.`,
        };
      }

      if (a === "T" && b === "F") {
        if (dominant === "T") {
          return {
            key: "TF",
            title,
            summary: `You lean about toward Thinking. You’re inclined to evaluate situations through logic, consistency and fairness of principles, even though feelings and harmony still matter to you in close relationships.`,
          };
        }
        return {
          key: "TF",
          title,
          summary: `You lean about toward Feeling. You’re more likely to prioritize people, impact and values in decisions, while still appreciating clear reasoning when stakes are high.`,
        };
      }

      // J vs P
      if (dominant === "J") {
        return {
          key: "JP",
          title,
          summary: `You lean about toward Judging. You probably feel calmer when plans, timelines and expectations are defined, even if you still enjoy some flexibility and last‑minute inspiration.`,
        };
      }
      return {
        key: "JP",
        title,
        summary: `You lean about toward Perceiving. You tend to keep options open, adapt in the moment and follow emerging opportunities, even if you can use structure when it serves your goals.`,
      };
    };

    return [
      describeAxis("E", "I", "How you recharge and show up socially"),
      describeAxis("S", "N", "How you take in and interpret information"),
      describeAxis("T", "F", "How you evaluate and make decisions"),
      describeAxis("J", "P", "How you like to organize your outer world"),
    ];
  }, [derivedPercentages]);

  // Detailed raw score analysis
  const rawScoreAnalysis = useMemo(() => {
    if (!result?.scores || !normalizedScores) return null;

    // Get max score from all scores for normalization (same as radar chart)
    const allScores = Object.values(result.scores);
    const maxScore = Math.max(...allScores);

    const pairs: [MbtiLetter, MbtiLetter, string][] = [
      ["E", "I", "Energy & Social Orientation"],
      ["S", "N", "Information Processing"],
      ["T", "F", "Decision Making"],
      ["J", "P", "Lifestyle & Organization"],
    ];

    return pairs.map(([a, b, title]) => {
      const aScore = result.scores[a];
      const bScore = result.scores[b];
      // Use the same normalization as radar chart (max-based)
      const aNormalized =
        maxScore > 0 ? Math.round((aScore / maxScore) * 100) : 50;
      const bNormalized =
        maxScore > 0 ? Math.round((bScore / maxScore) * 100) : 50;
      const difference = Math.abs(aScore - bScore);
      const dominant = aScore >= bScore ? a : b;
      const normalizedDiff = Math.abs(aNormalized - bNormalized);

      // Determine strength of preference based on normalized difference
      let strength:
        | "very-strong"
        | "strong"
        | "moderate"
        | "slight"
        | "balanced";
      let strengthLabel: string;
      let strengthDescription: string;

      if (normalizedDiff >= 80) {
        strength = "very-strong";
        strengthLabel = "Very Strong";
        strengthDescription =
          "This is a very clear and consistent preference. You show strong alignment with this trait across most situations.";
      } else if (normalizedDiff >= 60) {
        strength = "strong";
        strengthLabel = "Strong";
        strengthDescription =
          "You have a strong preference for this trait, though you can access the opposite when needed.";
      } else if (normalizedDiff >= 40) {
        strength = "moderate";
        strengthLabel = "Moderate";
        strengthDescription =
          "You have a moderate preference, showing flexibility while still leaning toward this trait.";
      } else if (normalizedDiff >= 20) {
        strength = "slight";
        strengthLabel = "Slight";
        strengthDescription =
          "You have a slight preference, showing significant flexibility and ability to use both sides.";
      } else {
        strength = "balanced";
        strengthLabel = "Balanced";
        strengthDescription =
          "You show a balanced approach, using both traits flexibly depending on the situation.";
      }

      // Generate comparison-based description
      const labelMap: Record<MbtiLetter, string> = {
        E: "Extraversion",
        I: "Introversion",
        S: "Sensing",
        N: "Intuition",
        T: "Thinking",
        F: "Feeling",
        J: "Judging",
        P: "Perceiving",
      };

      const aLabel = labelMap[a];
      const bLabel = labelMap[b];
      const dominantLabel = labelMap[dominant];
      const nonDominant = dominant === a ? b : a;
      const nonDominantLabel = labelMap[nonDominant];

      // Get normalized values for dominant and non-dominant
      const dominantNormalized = dominant === a ? aNormalized : bNormalized;
      const nonDominantNormalized = dominant === a ? bNormalized : aNormalized;

      let comparisonDescription: string;

      if (normalizedDiff >= 80) {
        comparisonDescription = `You show a very strong preference for ${dominantLabel} (${dominantNormalized}%) over ${nonDominantLabel} (${nonDominantNormalized}%). This is a clear and consistent pattern in your responses.`;
      } else if (normalizedDiff >= 60) {
        comparisonDescription = `You have a strong preference for ${dominantLabel} (${dominantNormalized}%) compared to ${nonDominantLabel} (${nonDominantNormalized}%). While you lean strongly in this direction, you can still access the opposite trait when needed.`;
      } else if (normalizedDiff >= 40) {
        comparisonDescription = `You show a moderate preference for ${dominantLabel} (${dominantNormalized}%) over ${nonDominantLabel} (${nonDominantNormalized}%). You have flexibility while still having a clear leaning.`;
      } else if (normalizedDiff >= 20) {
        comparisonDescription = `You have a slight preference for ${dominantLabel} (${dominantNormalized}%) compared to ${nonDominantLabel} (${nonDominantNormalized}%). The difference is noticeable but you show significant flexibility in using both traits.`;
      } else {
        comparisonDescription = `Your scores for ${aLabel} (${aNormalized}%) and ${bLabel} (${bNormalized}%) are very close, showing a balanced approach. You use both traits flexibly depending on the situation.`;
      }

      return {
        title,
        pair: [a, b] as [MbtiLetter, MbtiLetter],
        dominant,
        dominantLabel: labelMap[dominant],
        aScore,
        bScore,
        aNormalized,
        bNormalized,
        difference,
        normalizedDiff,
        strength,
        strengthLabel,
        strengthDescription,
        comparisonDescription,
      };
    });
  }, [result, normalizedScores]);

  // Show skeleton while hydrating
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <main className="flex w-full max-w-md flex-col rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-3xl md:px-10 md:py-10">
          <header className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48" />
          </header>

          <section className="mt-7 space-y-3 text-center md:text-left">
            <Skeleton className="h-4 w-20" />
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-baseline md:gap-4">
              <Skeleton className="h-12 w-32" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-3/4 max-w-md" />
          </section>

          <section className="mt-8">
            <Card className="bg-fuchsia-50/40">
              <CardHeader className="items-center pb-3 text-center">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto mt-2" />
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="mx-auto aspect-square max-h-[260px] w-full min-h-[220px] rounded-lg" />
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <Skeleton className="h-8 w-64 rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardFooter>
            </Card>
          </section>

          <section className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-zinc-50 px-4 py-3">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </div>
            ))}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <main className="flex w-full max-w-md flex-col rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-3xl md:px-10 md:py-10">
        <header className="flex items-center justify-center lg:justify-start w-full gap-3">
          <div className="flex flex-col items-center lg:items-start gap-1">
            <Image
              src="/logo.png"
              alt="MBTI Senpai"
              width={100}
              height={100}
              className="w-32 h-32 rounded-full"
            />
            <span className="inline-flex items-center text-center rounded-full bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text px-4 text-xl font-semibold tracking-wide text-transparent">
              Senpai&apos;s Opinionated MBTI Results
            </span>
            <span className="text-xs px-4 font-medium text-zinc-400">
              {result?.type && result.type !== "XXXX"
                ? SENPAI_MESSAGES[result.type] ||
                  "You're awesome. Senpai has got your back."
                : "You're awesome. Senpai has got your back. Take the test and find out your type."}
            </span>
          </div>
        </header>

        <div className="border-t border-zinc-200 w-full mt-4" />

        <section className="mt-7 space-y-1 text-center md:text-left">
          <p className="text-lg font-semibold capitalize text-pink-500">
            Your type
          </p>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-baseline md:gap-4">
            <h1 className="bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl">
              {mbtiType}
            </h1>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
            This result is based on how often you chose each side of the MBTI
            dichotomies across all questions in the test.
          </p>
          {!result && (
            <p className="text-xs text-red-500 sm:text-sm">
              No recent test result found. Please take the test first.
            </p>
          )}
          {result?.warning && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 sm:text-sm">
              <p className="font-semibold">⚠️ Notice:</p>
              <p className="mt-1">{result.warning}</p>
            </div>
          )}
        </section>

        <section className="mt-8">
          <Card className="bg-fuchsia-50/40">
            <CardHeader className="items-center pb-3 text-center">
              <CardTitle>Preference radar</CardTitle>
              <CardDescription>
                Raw scores normalized for visualization (hover to see actual
                values).
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[260px] w-full min-h-[220px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData} outerRadius="75%">
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <PolarAngleAxis dataKey="dimension" tickLine={false} />
                    <PolarGrid />
                    <Radar
                      dataKey="score"
                      stroke="var(--color-score)"
                      fill="var(--color-score)"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 text-xs text-zinc-600 sm:text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 font-medium text-zinc-800">
                <TrendingUp className="h-4 w-4 text-fuchsia-500" />
                {strongestPreferenceLabel}
              </div>
              {strongestPreference.description && (
                <div className="text-xs sm:text-sm">
                  {strongestPreference.description}
                </div>
              )}

              <div className="h-4 border-t border-zinc-200 w-full mt-4" />

              <p className="text-xs sm:text-sm text-zinc-500">
                Chart shows normalized raw scores. Hover over points to see
                actual score values. Scores are calculated from weighted
                question responses across the entire test.
              </p>
            </CardFooter>
          </Card>
        </section>

        <section className="mt-5 text-xs text-zinc-500 sm:text-sm">
          <p className="font-semibold capitalize text-pink-500">
            Letter meanings
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">E</span>
              <span>Extraversion</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">I</span>
              <span>Introversion</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">S</span>
              <span>Sensing</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">N</span>
              <span>Intuition</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">T</span>
              <span>Thinking</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">F</span>
              <span>Feeling</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">J</span>
              <span>Judging</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">P</span>
              <span>Perceiving</span>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-3 text-sm text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-zinc-900">What this means</p>
            <p className="text-xs text-zinc-500 sm:text-sm">
              Your four-letter type summarizes how you tend to get energy, take
              in information, make decisions and organize your outer world.
            </p>
          </div>
        </section>
        {result && result.type === "XXXX" && (
          <section className="mt-6 space-y-3 text-xs text-zinc-600 sm:text-sm">
            <div className="mt-3 space-y-1 rounded-xl bg-amber-50/60 px-4 py-3 border border-amber-200">
              <p className="text-sm font-semibold text-amber-900 sm:text-base">
                Unable to Determine Your Type
              </p>
              <p className="text-xs text-amber-800 sm:text-sm">
                All your answers were neutral, making it impossible to determine
                your MBTI type. Please retake the test and provide more
                definitive answers to get accurate results.
              </p>
            </div>
          </section>
        )}
        {result && result.type !== "XXXX" && TYPE_EXPLANATIONS[result.type] && (
          <section className="mt-6 space-y-3 text-xs text-zinc-600 sm:text-sm">
            <p className="font-semibold capitalize text-pink-500">
              {TYPE_EXPLANATIONS[result.type].groupTitle}
            </p>
            <p>{TYPE_EXPLANATIONS[result.type].groupDescription}</p>
            <div className="mt-3 space-y-1 rounded-xl bg-fuchsia-50/60 px-4 py-3">
              <p className="text-sm font-semibold text-zinc-900 sm:text-base">
                {mbtiType} — {TYPE_EXPLANATIONS[result.type].typeTitle}
              </p>
              <p>{TYPE_EXPLANATIONS[result.type].typeDescription}</p>
            </div>
            <div className="flex justify-center items-center">
              <Image
                src={`/personalities/${result.type.toLowerCase()}.png`}
                alt={result.type}
                width={400}
                height={400}
              />
            </div>
          </section>
        )}
        {dimensionNarratives.length > 0 && (
          <section className="mt-5 space-y-3 text-xs text-zinc-600 sm:text-sm">
            <p className="font-semibold capitalize text-pink-500">
              How your preferences play out in daily life
            </p>
            <ul className="mt-2 space-y-3">
              {dimensionNarratives.map((dim) => (
                <li
                  key={dim.key}
                  className="rounded-xl bg-zinc-50 px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
                >
                  <p className="text-xs font-semibold text-zinc-900 sm:text-sm">
                    {dim.title}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
                    {dim.summary}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
        {result &&
          result.type !== "XXXX" &&
          COMPATIBILITY_DATA[result.type] && (
            <section className="mt-8 space-y-4 text-xs text-zinc-600 sm:text-sm">
              <p className="font-semibold capitalize text-pink-500">
                Compatibility & Communication
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-green-50/60 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-green-800">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                      Energy Matches
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-green-700">
                      Types that share similar energy and communication styles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {COMPATIBILITY_DATA[result.type].energyMatches.map(
                        (type) => (
                          <span
                            key={type}
                            className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 sm:text-sm"
                          >
                            {type}
                          </span>
                        )
                      )}
                    </div>
                    <p className="mt-3 text-xs text-green-700 sm:text-sm">
                      These types tend to understand your energy levels and
                      communication preferences, making interactions feel more
                      natural and energizing.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50/60 border-amber-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-amber-800">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      Difficult Communication
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-amber-700">
                      Types that may require more effort to communicate with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {COMPATIBILITY_DATA[
                        result.type
                      ].difficultCommunication.map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 sm:text-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-amber-700 sm:text-sm">
                      These types have different communication styles and energy
                      needs. With patience and understanding, meaningful
                      connections are still possible.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        {rawScoreAnalysis && rawScoreAnalysis.length > 0 && (
          <DetailedScoreAnalysisSection rawScoreAnalysis={rawScoreAnalysis} />
        )}
        {result &&
          result.type !== "XXXX" &&
          TYPE_DEEP_ANALYSIS[result.type] && (
            <section className="mt-8 space-y-4 text-xs text-zinc-600 sm:text-sm">
              <p className="font-semibold capitalize text-pink-500 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Deep Analysis: {result.type}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-emerald-50/60 border-emerald-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-emerald-800">
                      <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
                      Strengths
                    </CardTitle>
                    <div className="border-t border-emerald-200 w-full" />
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-1">
                      {TYPE_DEEP_ANALYSIS[result.type].strengths.map(
                        (strength, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs sm:text-sm text-emerald-700"
                          >
                            <span className="text-emerald-500 mt-1">•</span>
                            <span>{strength}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-rose-50/60 border-rose-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-rose-800">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                      Growth Areas
                    </CardTitle>
                    <div className="border-t border-rose-200 w-full" />
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {TYPE_DEEP_ANALYSIS[result.type].growthAreas.map(
                        (area, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs sm:text-sm text-rose-700"
                          >
                            <span className="text-rose-500 mt-1">•</span>
                            <span>{area}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-50/60 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-blue-800">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                    Work Style
                  </CardTitle>
                  <div className="border-t border-blue-200 w-full" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-blue-700">
                    {TYPE_DEEP_ANALYSIS[result.type].workStyle}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50/60 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-purple-800">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    Relationship Style
                  </CardTitle>
                  <div className="border-t border-purple-200 w-full" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-purple-700">
                    {TYPE_DEEP_ANALYSIS[result.type].relationshipStyle}
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-amber-50/60 border-amber-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base text-amber-800">
                      Stress Triggers
                    </CardTitle>
                    <div className="border-t border-amber-200 w-full" />
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {TYPE_DEEP_ANALYSIS[result.type].stressTriggers.map(
                        (trigger, idx) => (
                          <li
                            key={idx}
                            className="text-xs sm:text-sm text-amber-700"
                          >
                            • {trigger}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-teal-50/60 border-teal-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base text-teal-800">
                      Communication Tips
                    </CardTitle>
                    <div className="border-t border-teal-200 w-full" />
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {TYPE_DEEP_ANALYSIS[result.type].communicationTips.map(
                        (tip, idx) => (
                          <li
                            key={idx}
                            className="text-xs sm:text-sm text-teal-700"
                          >
                            • {tip}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        <section className="mt-4 flex items-center justify-center flex-wrap gap-3">
          {result && (
            <Button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-100 px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm bg-white"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Share Result
                </>
              )}
            </Button>
          )}
          <Link
            href="/test"
            className="inline-flex items-center justify-center rounded-full border border-pink-100 px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm"
          >
            Retake test
          </Link>
          <Button className="bg-linear-to-r from-fuchsia-500 to-pink-500 text-white">
            <Link href="/">Return to Home</Link>
          </Button>
        </section>

        <footer className="mt-8 border-t border-zinc-100 pt-4 text-center text-[10px] text-zinc-400 sm:mt-10">
          <p>
            ©2025 MBTI Senpai · made with
            <span className="text-pink-500"> ♥ </span>
            by
            <span className="font-medium"> Khaing Myel Khant</span>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <main className="flex w-full max-w-md flex-col rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-3xl md:px-10 md:py-10">
            <header className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48" />
            </header>

            <section className="mt-7 space-y-3 text-center md:text-left">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-col items-center gap-2 md:flex-row md:items-baseline md:gap-4">
                <Skeleton className="h-12 w-32" />
              </div>
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-3/4 max-w-md" />
            </section>

            <section className="mt-8">
              <Card className="bg-fuchsia-50/40">
                <CardHeader className="items-center pb-3 text-center">
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-64 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="mx-auto aspect-square max-h-[260px] w-full min-h-[220px] rounded-lg" />
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2">
                  <Skeleton className="h-8 w-64 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardFooter>
              </Card>
            </section>

            <section className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-zinc-50 px-4 py-3">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-1" />
                </div>
              ))}
            </section>
          </main>
        </div>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}
