import type { CompatibilityInfo } from "../types";

export const COMPATIBILITY_DATA: Record<string, CompatibilityInfo> = {
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
