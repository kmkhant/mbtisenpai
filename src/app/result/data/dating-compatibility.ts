export type DatingCompatibilityInfo = {
  bestMatches: string[];
  goodMatches: string[];
  challengingMatches: string[];
  datingStyle: string;
  whatToLookFor: string;
  relationshipTips: string[];
};

export const DATING_COMPATIBILITY: Record<string, DatingCompatibilityInfo> = {
  INTJ: {
    bestMatches: ["ENFP", "ENTP"],
    goodMatches: ["INTP", "INFJ", "ENTJ"],
    challengingMatches: ["ESFP", "ESTP", "ESFJ"],
    datingStyle:
      "INTJs value deep, intellectual connections over surface-level attraction. They prefer meaningful conversations and shared goals. They show love through problem-solving and long-term planning rather than grand romantic gestures.",
    whatToLookFor:
      "Look for partners who appreciate your independence, respect your need for alone time, and engage in stimulating intellectual discussions. Someone who values your strategic thinking and doesn't require constant emotional reassurance.",
    relationshipTips: [
      "Communicate your need for space clearly",
      "Share your plans and thoughts with your partner",
      "Practice expressing emotions, even if it feels uncomfortable",
      "Find activities that combine intellectual and emotional connection",
      "Be patient with partners who express emotions differently",
    ],
  },
  INTP: {
    bestMatches: ["ENTJ", "ESTJ"],
    goodMatches: ["INTJ", "INFP", "ENFP"],
    challengingMatches: ["ESFJ", "ESTJ", "ESFP"],
    datingStyle:
      "INTPs approach dating with curiosity and intellectual interest. They value partners who can engage in deep discussions and appreciate their unique perspectives. They may struggle with traditional dating rituals but show care through thoughtful analysis and problem-solving.",
    whatToLookFor:
      "Seek partners who enjoy intellectual debates, respect your need for independence, and don't pressure you into social situations. Someone who appreciates your logical approach and gives you space to process emotions.",
    relationshipTips: [
      "Make time for your partner despite your love for solitude",
      "Express appreciation and affection in ways that feel authentic",
      "Engage in shared intellectual interests",
      "Be open to trying new activities together",
      "Communicate your feelings, even if it's challenging",
    ],
  },
  ENTJ: {
    bestMatches: ["INTP", "INFP"],
    goodMatches: ["INTJ", "ENTP", "ENFP"],
    challengingMatches: ["ISFP", "ISFJ", "ISTP"],
    datingStyle:
      "ENTJs are direct and goal-oriented in relationships. They value efficiency and clear communication. They show love through actions, planning for the future, and helping their partner achieve goals. They appreciate partners who are independent and ambitious.",
    whatToLookFor:
      "Find partners who appreciate your drive, respect your need for achievement, and can handle direct communication. Someone who values efficiency and doesn't require constant emotional validation.",
    relationshipTips: [
      "Balance work goals with relationship time",
      "Practice patience with different communication styles",
      "Show appreciation for your partner's emotional needs",
      "Make time for fun and relaxation together",
      "Listen actively, not just to solve problems",
    ],
  },
  ENTP: {
    bestMatches: ["INFJ", "INTJ"],
    goodMatches: ["INFP", "ENFP", "ENTJ"],
    challengingMatches: ["ISFJ", "ISTJ", "ISFP"],
    datingStyle:
      "ENTPs bring energy and excitement to relationships. They love intellectual stimulation, debates, and trying new things together. They show affection through engaging conversations and shared adventures. They need partners who appreciate their spontaneity.",
    whatToLookFor:
      "Look for partners who enjoy intellectual debates, appreciate your spontaneity, and don't try to control or restrict you. Someone who can keep up with your energy and values authentic connections.",
    relationshipTips: [
      "Follow through on commitments and promises",
      "Balance debate with emotional support",
      "Make time for deep, meaningful conversations",
      "Respect your partner's need for stability",
      "Express emotions, not just ideas",
    ],
  },
  INFJ: {
    bestMatches: ["ENFP", "ENTP"],
    goodMatches: ["INTJ", "INFP", "ENFJ"],
    challengingMatches: ["ESTP", "ESTJ", "ESFP"],
    datingStyle:
      "INFJs seek deep, meaningful connections. They value authenticity and emotional intimacy. They show love through understanding, support, and helping their partner grow. They need partners who appreciate their intuitive insights and emotional depth.",
    whatToLookFor:
      "Seek partners who value deep connections, appreciate your empathy, and respect your need for alone time. Someone who understands your complex inner world and doesn't dismiss your insights.",
    relationshipTips: [
      "Set boundaries to avoid emotional exhaustion",
      "Communicate your needs clearly",
      "Don't lose yourself in your partner's needs",
      "Find balance between giving and receiving",
      "Trust your intuition but also communicate openly",
    ],
  },
  INFP: {
    bestMatches: ["ENFJ", "ENTJ"],
    goodMatches: ["INFJ", "ENFP", "INTP"],
    challengingMatches: ["ESTJ", "ESTP", "ESFJ"],
    datingStyle:
      "INFPs are romantic idealists who value authentic, deep connections. They show love through creativity, thoughtful gestures, and emotional support. They need partners who appreciate their values and give them space to be themselves.",
    whatToLookFor:
      "Find partners who share your values, appreciate your creativity, and respect your need for authenticity. Someone who understands your emotional depth and doesn't try to change your sensitive nature.",
    relationshipTips: [
      "Express your needs and boundaries clearly",
      "Don't idealize your partner - see them realistically",
      "Balance idealism with practical relationship needs",
      "Share your creative interests with your partner",
      "Practice self-care to avoid emotional overwhelm",
    ],
  },
  ENFJ: {
    bestMatches: ["INFP", "ISFP"],
    goodMatches: ["INFJ", "ENFP", "INTJ"],
    challengingMatches: ["ISTP", "ISTJ", "ISFP"],
    datingStyle:
      "ENFJs are warm, caring partners who prioritize their partner's happiness. They show love through support, encouragement, and helping their partner grow. They value emotional connection and meaningful conversations. They need partners who appreciate their giving nature.",
    whatToLookFor:
      "Seek partners who appreciate your caring nature, value emotional connection, and can handle your need to help others. Someone who gives back and doesn't take your generosity for granted.",
    relationshipTips: [
      "Don't neglect your own needs",
      "Set boundaries to avoid being taken advantage of",
      "Balance helping others with self-care",
      "Communicate your own needs clearly",
      "Find partners who appreciate your giving nature",
    ],
  },
  ENFP: {
    bestMatches: ["INFJ", "INTJ"],
    goodMatches: ["INFP", "ENTP", "ENFJ"],
    challengingMatches: ["ISTJ", "ISTP", "ISFJ"],
    datingStyle:
      "ENFPs bring enthusiasm and warmth to relationships. They show love through excitement, creativity, and emotional expression. They value authentic connections and need partners who appreciate their spontaneity and emotional depth.",
    whatToLookFor:
      "Look for partners who appreciate your enthusiasm, value emotional connection, and don't try to restrict your freedom. Someone who enjoys adventure and understands your need for variety.",
    relationshipTips: [
      "Follow through on commitments",
      "Balance spontaneity with reliability",
      "Make time for deep conversations",
      "Respect your partner's need for structure",
      "Express your emotions authentically",
    ],
  },
  ISTJ: {
    bestMatches: ["ESFP", "ESTP"],
    goodMatches: ["ISFJ", "ESTJ", "ESFJ"],
    challengingMatches: ["ENFP", "ENTP", "ENFJ"],
    datingStyle:
      "ISTJs are reliable, loyal partners who show love through consistent actions and commitment. They value stability and tradition. They need partners who appreciate their dependability and don't require constant emotional expression.",
    whatToLookFor:
      "Find partners who appreciate your reliability, respect your need for routine, and value commitment. Someone who understands your practical approach and doesn't pressure you into spontaneity.",
    relationshipTips: [
      "Express your feelings, even if it's challenging",
      "Be open to trying new things occasionally",
      "Show appreciation for your partner regularly",
      "Balance routine with some spontaneity",
      "Communicate your needs clearly",
    ],
  },
  ISFJ: {
    bestMatches: ["ESFP", "ESTP"],
    goodMatches: ["ISTJ", "ESFJ", "ESTJ"],
    challengingMatches: ["ENTP", "ENTJ", "ENFP"],
    datingStyle:
      "ISFJs are caring, devoted partners who show love through acts of service and attention to their partner's needs. They value stability and emotional security. They need partners who appreciate their thoughtfulness and give back.",
    whatToLookFor:
      "Seek partners who appreciate your caring nature, value emotional connection, and don't take your kindness for granted. Someone who shows appreciation and gives back to the relationship.",
    relationshipTips: [
      "Don't neglect your own needs",
      "Set boundaries to avoid being taken advantage of",
      "Express your needs clearly",
      "Balance giving with receiving",
      "Find partners who appreciate your thoughtfulness",
    ],
  },
  ESTJ: {
    bestMatches: ["ISFP", "ISTP"],
    goodMatches: ["ISTJ", "ESFJ", "ENTJ"],
    challengingMatches: ["INFP", "ISFP", "INTP"],
    datingStyle:
      "ESTJs are responsible, committed partners who show love through providing stability and taking care of practical matters. They value efficiency and clear communication. They need partners who appreciate their leadership and reliability.",
    whatToLookFor:
      "Look for partners who appreciate your reliability, respect your need for structure, and value commitment. Someone who understands your practical approach and doesn't require constant emotional validation.",
    relationshipTips: [
      "Balance work with relationship time",
      "Show appreciation for your partner's emotional needs",
      "Be open to spontaneity occasionally",
      "Listen to your partner's feelings",
      "Make time for fun and relaxation",
    ],
  },
  ESFJ: {
    bestMatches: ["ISFP", "ISTP"],
    goodMatches: ["ISFJ", "ESTJ", "ESFP"],
    challengingMatches: ["INTP", "INTJ", "ISTP"],
    datingStyle:
      "ESFJs are warm, caring partners who show love through attention, support, and creating a harmonious environment. They value emotional connection and social harmony. They need partners who appreciate their thoughtfulness and give back.",
    whatToLookFor:
      "Find partners who appreciate your caring nature, value emotional connection, and enjoy social activities. Someone who shows appreciation and doesn't take your kindness for granted.",
    relationshipTips: [
      "Don't neglect your own needs",
      "Set boundaries to avoid being overwhelmed",
      "Balance social activities with alone time",
      "Express your needs clearly",
      "Find partners who appreciate your warmth",
    ],
  },
  ISTP: {
    bestMatches: ["ESTJ", "ESFJ"],
    goodMatches: ["ISFP", "ESTP", "ESFP"],
    challengingMatches: ["ENFJ", "ENFP", "ENTJ"],
    datingStyle:
      "ISTPs are independent, practical partners who show love through actions rather than words. They value freedom and space. They need partners who appreciate their independence and don't require constant emotional expression.",
    whatToLookFor:
      "Seek partners who respect your independence, appreciate your practical skills, and don't pressure you into emotional conversations. Someone who gives you space and values your autonomy.",
    relationshipTips: [
      "Express your feelings occasionally",
      "Make time for your partner despite your need for space",
      "Show appreciation through actions",
      "Be open to trying new activities together",
      "Communicate your need for independence clearly",
    ],
  },
  ISFP: {
    bestMatches: ["ESFJ", "ESTJ"],
    goodMatches: ["ISTP", "ESFP", "ESTP"],
    challengingMatches: ["ENTJ", "ENTP", "ENFJ"],
    datingStyle:
      "ISFPs are gentle, caring partners who show love through creativity, thoughtful gestures, and emotional support. They value authenticity and harmony. They need partners who appreciate their sensitive nature and give them space.",
    whatToLookFor:
      "Look for partners who appreciate your creativity, respect your need for space, and value emotional connection. Someone who understands your sensitive nature and doesn't try to change you.",
    relationshipTips: [
      "Express your needs and boundaries clearly",
      "Don't avoid conflict - communicate openly",
      "Balance harmony with authenticity",
      "Share your creative interests",
      "Practice self-care to avoid overwhelm",
    ],
  },
  ESTP: {
    bestMatches: ["ISFJ", "ISTJ"],
    goodMatches: ["ISTP", "ESFP", "ESTJ"],
    challengingMatches: ["INFJ", "INFP", "INTJ"],
    datingStyle:
      "ESTPs are fun, adventurous partners who show love through shared experiences and excitement. They value living in the moment and need partners who appreciate their spontaneity and energy.",
    whatToLookFor:
      "Find partners who enjoy adventure, appreciate your spontaneity, and don't try to restrict your freedom. Someone who can keep up with your energy and values authentic connections.",
    relationshipTips: [
      "Make time for deeper conversations",
      "Follow through on commitments",
      "Balance fun with emotional connection",
      "Respect your partner's need for planning",
      "Express your feelings, not just actions",
    ],
  },
  ESFP: {
    bestMatches: ["ISFJ", "ISTJ"],
    goodMatches: ["ISFP", "ESTP", "ESFJ"],
    challengingMatches: ["INTJ", "INTP", "INFJ"],
    datingStyle:
      "ESFPs are fun, enthusiastic partners who show love through excitement, spontaneity, and emotional expression. They value living in the moment and need partners who appreciate their energy and warmth.",
    whatToLookFor:
      "Seek partners who enjoy fun activities, appreciate your enthusiasm, and value emotional connection. Someone who can keep up with your energy and doesn't try to restrict your spontaneity.",
    relationshipTips: [
      "Make time for deeper conversations",
      "Balance fun with commitment",
      "Follow through on promises",
      "Respect your partner's need for planning",
      "Express your emotions authentically",
    ],
  },
};
