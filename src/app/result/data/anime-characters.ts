export type AnimeCharacterInfo = {
  characters: Array<{
    name: string;
    anime: string;
    description: string;
  }>;
  commonTraits: string[];
  whyThisMatch: string;
};

export const ANIME_CHARACTER_DATA: Record<string, AnimeCharacterInfo> = {
  INTJ: {
    characters: [
      {
        name: "Lelouch vi Britannia",
        anime: "Code Geass",
        description: "Strategic mastermind who plans complex long-term schemes",
      },
      {
        name: "Light Yagami",
        anime: "Death Note",
        description:
          "Brilliant strategist with a vision for changing the world",
      },
      {
        name: "Shikamaru Nara",
        anime: "Naruto",
        description: "Tactical genius who prefers planning over action",
      },
    ],
    commonTraits: [
      "Strategic thinking",
      "Long-term planning",
      "Independent",
      "Intellectual",
      "Goal-oriented",
    ],
    whyThisMatch:
      "INTJs like these characters are master strategists who think several steps ahead. They value efficiency, independence, and have a clear vision for the future. They prefer working alone or with a small trusted circle.",
  },
  INTP: {
    characters: [
      {
        name: "Shinichi Kudo (Conan Edogawa)",
        anime: "Detective Conan",
        description: "Analytical detective who loves solving complex puzzles",
      },
      {
        name: "Senku Ishigami",
        anime: "Dr. Stone",
        description:
          "Scientific genius who rebuilds civilization through logic",
      },
      {
        name: "Saiki Kusuo",
        anime: "The Disastrous Life of Saiki K.",
        description:
          "Overpowered but prefers to avoid attention and analyze situations",
      },
    ],
    commonTraits: [
      "Analytical",
      "Curious",
      "Logical",
      "Independent",
      "Problem-solver",
    ],
    whyThisMatch:
      "INTPs share these characters' love for analysis and problem-solving. They're curious about how things work and prefer to observe and think rather than act impulsively. They value logic and intellectual freedom.",
  },
  ENTJ: {
    characters: [
      {
        name: "Erwin Smith",
        anime: "Attack on Titan",
        description:
          "Natural leader who makes strategic decisions for his team",
      },
      {
        name: "Roy Mustang",
        anime: "Fullmetal Alchemist",
        description: "Ambitious leader with clear goals and strategic thinking",
      },
      {
        name: "Sosuke Aizen",
        anime: "Bleach",
        description: "Charismatic leader with long-term plans and ambition",
      },
    ],
    commonTraits: [
      "Natural leader",
      "Strategic",
      "Ambitious",
      "Goal-oriented",
      "Decisive",
    ],
    whyThisMatch:
      "ENTJs like these characters are born leaders who excel at organizing and leading others toward goals. They're strategic, ambitious, and make decisive decisions. They value efficiency and results.",
  },
  ENTP: {
    characters: [
      {
        name: "Hisoka",
        anime: "Hunter x Hunter",
        description: "Unpredictable and enjoys intellectual challenges",
      },
      {
        name: "Joseph Joestar",
        anime: "JoJo's Bizarre Adventure",
        description: "Creative problem-solver who thinks outside the box",
      },
      {
        name: "Karma Akabane",
        anime: "Assassination Classroom",
        description:
          "Intelligent troublemaker who loves challenges and debates",
      },
    ],
    commonTraits: [
      "Debater",
      "Innovative",
      "Adaptable",
      "Energetic",
      "Unpredictable",
    ],
    whyThisMatch:
      "ENTPs share these characters' love for intellectual challenges and debates. They're innovative, adaptable, and enjoy pushing boundaries. They thrive on variety and intellectual stimulation.",
  },
  INFJ: {
    characters: [
      {
        name: "Itachi Uchiha",
        anime: "Naruto",
        description: "Deep, complex character who sacrifices for greater good",
      },
      {
        name: "Kakashi Hatake",
        anime: "Naruto",
        description: "Wise mentor who understands people deeply",
      },
      {
        name: "Rei Ayanami",
        anime: "Neon Genesis Evangelion",
        description:
          "Mysterious and insightful, with deep emotional complexity",
      },
    ],
    commonTraits: [
      "Insightful",
      "Empathetic",
      "Complex",
      "Visionary",
      "Mysterious",
    ],
    whyThisMatch:
      "INFJs like these characters are deep, insightful individuals who understand people and situations on a profound level. They're empathetic, complex, and often have a vision for helping others.",
  },
  INFP: {
    characters: [
      {
        name: "Izuku Midoriya (Deku)",
        anime: "My Hero Academia",
        description: "Idealistic hero who fights for what he believes in",
      },
      {
        name: "Naruto Uzumaki",
        anime: "Naruto",
        description: "Determined dreamer who never gives up on his ideals",
      },
      {
        name: "Tanjiro Kamado",
        anime: "Demon Slayer",
        description: "Kind-hearted and values-driven, fights for family",
      },
    ],
    commonTraits: [
      "Idealistic",
      "Values-driven",
      "Empathetic",
      "Determined",
      "Creative",
    ],
    whyThisMatch:
      "INFPs share these characters' idealism and strong values. They're empathetic, creative, and fight for what they believe in. They value authenticity and have a deep sense of purpose.",
  },
  ENFJ: {
    characters: [
      {
        name: "All Might",
        anime: "My Hero Academia",
        description: "Inspiring hero who motivates and protects others",
      },
      {
        name: "Obito Uchiha",
        anime: "Naruto",
        description: "Charismatic leader who wants to create a better world",
      },
      {
        name: "Erza Scarlet",
        anime: "Fairy Tail",
        description: "Strong leader who cares deeply for her team",
      },
    ],
    commonTraits: [
      "Inspiring",
      "Caring",
      "Natural leader",
      "Charismatic",
      "Protective",
    ],
    whyThisMatch:
      "ENFJs like these characters are natural leaders who inspire and care for others. They're charismatic, protective, and want to help people grow. They value harmony and meaningful connections.",
  },
  ENFP: {
    characters: [
      {
        name: "Luffy",
        anime: "One Piece",
        description: "Adventurous, free-spirited, and follows his dreams",
      },
      {
        name: "Natsu Dragneel",
        anime: "Fairy Tail",
        description: "Energetic and passionate, values friendship above all",
      },
      {
        name: "Gon Freecss",
        anime: "Hunter x Hunter",
        description: "Enthusiastic and curious, always seeking adventure",
      },
    ],
    commonTraits: [
      "Enthusiastic",
      "Adventurous",
      "Free-spirited",
      "Passionate",
      "Optimistic",
    ],
    whyThisMatch:
      "ENFPs share these characters' enthusiasm and love for adventure. They're optimistic, free-spirited, and value authentic connections. They bring energy and excitement wherever they go.",
  },
  ISTJ: {
    characters: [
      {
        name: "Levi Ackerman",
        anime: "Attack on Titan",
        description: "Disciplined, reliable, and follows procedures perfectly",
      },
      {
        name: "Shoto Todoroki",
        anime: "My Hero Academia",
        description: "Serious, methodical, and values tradition",
      },
      {
        name: "Byakuya Kuchiki",
        anime: "Bleach",
        description: "Traditional, disciplined, and follows rules strictly",
      },
    ],
    commonTraits: [
      "Reliable",
      "Disciplined",
      "Traditional",
      "Methodical",
      "Duty-bound",
    ],
    whyThisMatch:
      "ISTJs like these characters are reliable and disciplined. They value tradition, follow procedures, and take their responsibilities seriously. They're methodical and prefer structure.",
  },
  ISFJ: {
    characters: [
      {
        name: "Hinata Hyuga",
        anime: "Naruto",
        description: "Kind, supportive, and cares deeply for others",
      },
      {
        name: "Ochaco Uraraka",
        anime: "My Hero Academia",
        description: "Caring, supportive friend who helps others",
      },
      {
        name: "Mikasa Ackerman",
        anime: "Attack on Titan",
        description: "Loyal protector who cares deeply for loved ones",
      },
    ],
    commonTraits: ["Caring", "Supportive", "Loyal", "Protective", "Thoughtful"],
    whyThisMatch:
      "ISFJs share these characters' caring and supportive nature. They're loyal, protective, and show love through actions. They value stability and take care of those they care about.",
  },
  ESTJ: {
    characters: [
      {
        name: "Endeavor",
        anime: "My Hero Academia",
        description: "Ambitious leader focused on results and efficiency",
      },
      {
        name: "Sasuke Uchiha (adult)",
        anime: "Naruto",
        description: "Serious, goal-oriented, and values efficiency",
      },
      {
        name: "Vegeta",
        anime: "Dragon Ball Z",
        description: "Proud leader who values strength and achievement",
      },
    ],
    commonTraits: [
      "Organized",
      "Goal-oriented",
      "Efficient",
      "Leader",
      "Results-focused",
    ],
    whyThisMatch:
      "ESTJs like these characters are organized leaders who value efficiency and results. They're goal-oriented, take charge, and prefer structured approaches. They value tradition and achievement.",
  },
  ESFJ: {
    characters: [
      {
        name: "Momo Yaoyorozu",
        anime: "My Hero Academia",
        description: "Caring leader who supports and organizes her team",
      },
      {
        name: "Sakura Haruno",
        anime: "Naruto",
        description: "Supportive friend who cares for her teammates",
      },
      {
        name: "Orihime Inoue",
        anime: "Bleach",
        description: "Warm, caring, and always thinking of others",
      },
    ],
    commonTraits: ["Caring", "Organized", "Supportive", "Social", "Harmonious"],
    whyThisMatch:
      "ESFJs share these characters' caring and organized nature. They're supportive, social, and work to maintain harmony. They value relationships and show care through thoughtful actions.",
  },
  ISTP: {
    characters: [
      {
        name: "Kakashi Hatake (young)",
        anime: "Naruto",
        description: "Skilled, independent, and prefers to work alone",
      },
      {
        name: "Killua Zoldyck",
        anime: "Hunter x Hunter",
        description: "Skilled assassin who values independence and freedom",
      },
      {
        name: "Spike Spiegel",
        anime: "Cowboy Bebop",
        description: "Cool, independent, and skilled at what he does",
      },
    ],
    commonTraits: [
      "Independent",
      "Skilled",
      "Practical",
      "Cool-headed",
      "Freedom-loving",
    ],
    whyThisMatch:
      "ISTPs like these characters are independent and skilled. They value freedom, prefer hands-on work, and stay cool under pressure. They're practical problem-solvers who work best alone.",
  },
  ISFP: {
    characters: [
      {
        name: "Zoro Roronoa",
        anime: "One Piece",
        description: "Loyal, skilled, and values personal freedom",
      },
      {
        name: "Katsuki Bakugo",
        anime: "My Hero Academia",
        description: "Passionate and authentic, values personal strength",
      },
      {
        name: "Inosuke Hashibira",
        anime: "Demon Slayer",
        description: "Wild, authentic, and follows his own path",
      },
    ],
    commonTraits: [
      "Authentic",
      "Skilled",
      "Independent",
      "Passionate",
      "Freedom-loving",
    ],
    whyThisMatch:
      "ISFPs share these characters' authenticity and independence. They're skilled, passionate, and value personal freedom. They're creative and prefer to follow their own path.",
  },
  ESTP: {
    characters: [
      {
        name: "Sanji",
        anime: "One Piece",
        description:
          "Action-oriented, lives in the moment, and skilled fighter",
      },
      {
        name: "Killua Zoldyck (adventurous side)",
        anime: "Hunter x Hunter",
        description: "Energetic, action-loving, and enjoys challenges",
      },
      {
        name: "Yusuke Urameshi",
        anime: "Yu Yu Hakusho",
        description: "Impulsive, action-oriented, and lives in the moment",
      },
    ],
    commonTraits: [
      "Action-oriented",
      "Energetic",
      "Lives in moment",
      "Skilled",
      "Risk-taker",
    ],
    whyThisMatch:
      "ESTPs like these characters are action-oriented and live in the moment. They're energetic, skilled, and enjoy taking risks. They prefer action over planning and thrive on excitement.",
  },
  ESFP: {
    characters: [
      {
        name: "Usopp",
        anime: "One Piece",
        description: "Fun-loving, creative, and brings energy to the crew",
      },
      {
        name: "Mineta Minoru",
        anime: "My Hero Academia",
        description: "Energetic, social, and lives in the moment",
      },
      {
        name: "Happy",
        anime: "Fairy Tail",
        description: "Cheerful, fun-loving, and brings joy to others",
      },
    ],
    commonTraits: [
      "Fun-loving",
      "Energetic",
      "Social",
      "Creative",
      "Optimistic",
    ],
    whyThisMatch:
      "ESFPs share these characters' fun-loving and energetic nature. They're social, creative, and bring joy to others. They live in the moment and value fun experiences.",
  },
};
