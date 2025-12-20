export type CelebrityInfo = {
  movieStars: Array<{
    name: string;
    description: string;
  }>;
  singers: Array<{
    name: string;
    description: string;
  }>;
  commonTraits: string[];
  whyThisMatch: string;
};

export const CELEBRITY_DATA: Record<string, CelebrityInfo> = {
  INTJ: {
    movieStars: [
      {
        name: "Christopher Nolan",
        description:
          "Visionary director known for complex, strategic storytelling",
      },
      {
        name: "Stephen Hawking",
        description: "Brilliant theoretical physicist and strategic thinker",
      },
      {
        name: "Elon Musk",
        description: "Strategic entrepreneur with long-term vision",
      },
    ],
    singers: [
      {
        name: "David Bowie",
        description:
          "Innovative artist with strategic approach to music and persona",
      },
      {
        name: "Björk",
        description: "Experimental musician with unique artistic vision",
      },
      {
        name: "Trent Reznor",
        description: "Strategic composer known for complex, layered music",
      },
    ],
    commonTraits: [
      "Strategic thinking",
      "Visionary",
      "Independent",
      "Intellectual",
      "Innovative",
    ],
    whyThisMatch:
      "INTJs like these celebrities are strategic visionaries who think long-term. They're independent, intellectual, and known for their innovative approaches to their craft. They value efficiency and have clear goals.",
  },
  INTP: {
    movieStars: [
      {
        name: "Albert Einstein",
        description:
          "Theoretical physicist who revolutionized scientific thinking",
      },
      {
        name: "Bill Gates",
        description: "Analytical problem-solver and tech innovator",
      },
      {
        name: "Mark Zuckerberg",
        description: "Logical thinker focused on systems and innovation",
      },
    ],
    singers: [
      {
        name: "Brian Eno",
        description: "Experimental musician and innovative producer",
      },
      {
        name: "Aphex Twin",
        description: "Analytical electronic music composer",
      },
      {
        name: "Frank Zappa",
        description: "Complex, theoretical approach to music composition",
      },
    ],
    commonTraits: [
      "Analytical",
      "Curious",
      "Logical",
      "Innovative",
      "Independent",
    ],
    whyThisMatch:
      "INTPs share these celebrities' analytical and curious nature. They're logical thinkers who love exploring ideas and solving complex problems. They value intellectual freedom and innovation.",
  },
  ENTJ: {
    movieStars: [
      {
        name: "Steve Jobs",
        description: "Visionary leader who transformed technology",
      },
      {
        name: "Oprah Winfrey",
        description: "Natural leader and influential media executive",
      },
      {
        name: "Hillary Clinton",
        description: "Strategic leader with clear goals and ambition",
      },
    ],
    singers: [
      {
        name: "Jay-Z",
        description: "Strategic business leader and influential artist",
      },
      {
        name: "Dr. Dre",
        description: "Entrepreneurial leader in music and business",
      },
      {
        name: "Beyoncé",
        description: "Ambitious performer with strategic career planning",
      },
    ],
    commonTraits: [
      "Natural leader",
      "Strategic",
      "Ambitious",
      "Goal-oriented",
      "Influential",
    ],
    whyThisMatch:
      "ENTJs like these celebrities are natural leaders who excel at organizing and achieving goals. They're strategic, ambitious, and make decisive decisions. They value efficiency and results.",
  },
  ENTP: {
    movieStars: [
      {
        name: "Tom Hanks",
        description: "Versatile actor known for adaptability and charm",
      },
      {
        name: "Robert Downey Jr.",
        description: "Quick-witted and adaptable performer",
      },
      {
        name: "Will Smith",
        description: "Energetic and innovative entertainer",
      },
    ],
    singers: [
      {
        name: "Eminem",
        description: "Quick-thinking lyricist and innovative rapper",
      },
      {
        name: "Lady Gaga",
        description: "Innovative and adaptable performer",
      },
      {
        name: "Kanye West",
        description: "Creative innovator who pushes boundaries",
      },
    ],
    commonTraits: [
      "Innovative",
      "Adaptable",
      "Quick-thinking",
      "Energetic",
      "Persuasive",
    ],
    whyThisMatch:
      "ENTPs share these celebrities' love for innovation and adaptability. They're quick-thinking, energetic, and enjoy pushing boundaries. They thrive on variety and intellectual stimulation.",
  },
  INFJ: {
    movieStars: [
      {
        name: "Morgan Freeman",
        description: "Wise, insightful actor with deep understanding",
      },
      {
        name: "Natalie Portman",
        description: "Thoughtful performer with intellectual depth",
      },
      {
        name: "Cate Blanchett",
        description: "Complex, insightful actress with artistic vision",
      },
    ],
    singers: [
      {
        name: "Tori Amos",
        description: "Deep, introspective songwriter with emotional complexity",
      },
      {
        name: "Fiona Apple",
        description: "Insightful artist with profound emotional depth",
      },
      {
        name: "Alanis Morissette",
        description: "Intuitive songwriter with deep emotional insight",
      },
    ],
    commonTraits: [
      "Insightful",
      "Empathetic",
      "Complex",
      "Visionary",
      "Authentic",
    ],
    whyThisMatch:
      "INFJs like these celebrities are insightful individuals who understand people deeply. They're empathetic, complex, and often have a vision for helping others through their art.",
  },
  INFP: {
    movieStars: [
      {
        name: "Johnny Depp",
        description: "Creative, authentic actor with unique artistic vision",
      },
      {
        name: "Keanu Reeves",
        description: "Genuine, values-driven performer",
      },
      {
        name: "Tim Burton",
        description: "Creative director with unique artistic vision",
      },
    ],
    singers: [
      {
        name: "Kurt Cobain",
        description: "Authentic, values-driven songwriter",
      },
      {
        name: "Joni Mitchell",
        description: "Creative, introspective singer-songwriter",
      },
      {
        name: "Elliott Smith",
        description: "Sensitive, authentic songwriter",
      },
    ],
    commonTraits: [
      "Idealistic",
      "Authentic",
      "Creative",
      "Values-driven",
      "Empathetic",
    ],
    whyThisMatch:
      "INFPs share these celebrities' idealism and authenticity. They're creative, values-driven, and express themselves through their art. They value genuine connections and have deep emotions.",
  },
  ENFJ: {
    movieStars: [
      {
        name: "Meryl Streep",
        description: "Inspiring actress who brings depth to every role",
      },
      {
        name: "Denzel Washington",
        description: "Charismatic leader and inspiring performer",
      },
      {
        name: "Emma Watson",
        description: "Inspiring advocate and thoughtful actress",
      },
    ],
    singers: [
      {
        name: "Adele",
        description: "Emotionally expressive singer who connects deeply",
      },
      {
        name: "John Legend",
        description: "Inspiring artist and advocate",
      },
      {
        name: "Alicia Keys",
        description: "Empowering performer and advocate",
      },
    ],
    commonTraits: [
      "Inspiring",
      "Charismatic",
      "Empathetic",
      "Natural leader",
      "Caring",
    ],
    whyThisMatch:
      "ENFJs like these celebrities are natural leaders who inspire others. They're charismatic, empathetic, and want to help people grow. They value meaningful connections and harmony.",
  },
  ENFP: {
    movieStars: [
      {
        name: "Robin Williams",
        description: "Enthusiastic, energetic performer who brought joy",
      },
      {
        name: "Jim Carrey",
        description: "Energetic, creative comedian and actor",
      },
      {
        name: "Ellen DeGeneres",
        description: "Enthusiastic, warm entertainer",
      },
    ],
    singers: [
      {
        name: "Pharrell Williams",
        description: "Energetic, creative producer and artist",
      },
      {
        name: "Bruno Mars",
        description: "Enthusiastic, versatile performer",
      },
      {
        name: "Ariana Grande",
        description: "Energetic, expressive singer",
      },
    ],
    commonTraits: [
      "Enthusiastic",
      "Creative",
      "Energetic",
      "Expressive",
      "Optimistic",
    ],
    whyThisMatch:
      "ENFPs share these celebrities' enthusiasm and creativity. They're energetic, expressive, and bring joy to others. They value authentic connections and love variety.",
  },
  ISTJ: {
    movieStars: [
      {
        name: "Clint Eastwood",
        description: "Disciplined, traditional actor and director",
      },
      {
        name: "Tom Hanks",
        description: "Reliable, methodical performer",
      },
      {
        name: "Daniel Day-Lewis",
        description: "Dedicated, disciplined method actor",
      },
    ],
    singers: [
      {
        name: "Johnny Cash",
        description: "Traditional, reliable country music legend",
      },
      {
        name: "Bob Dylan",
        description: "Methodical, traditional songwriter",
      },
      {
        name: "Bruce Springsteen",
        description: "Reliable, hardworking rock performer",
      },
    ],
    commonTraits: [
      "Reliable",
      "Disciplined",
      "Traditional",
      "Methodical",
      "Dedicated",
    ],
    whyThisMatch:
      "ISTJs like these celebrities are reliable and disciplined. They value tradition, follow procedures, and take their craft seriously. They're methodical and prefer structure.",
  },
  ISFJ: {
    movieStars: [
      {
        name: "Kate Winslet",
        description: "Caring, supportive actress known for warmth",
      },
      {
        name: "Anne Hathaway",
        description: "Thoughtful, caring performer",
      },
      {
        name: "Emma Stone",
        description: "Warm, supportive actress",
      },
    ],
    singers: [
      {
        name: "Taylor Swift",
        description: "Thoughtful, caring songwriter",
      },
      {
        name: "Ed Sheeran",
        description: "Warm, supportive singer-songwriter",
      },
      {
        name: "Adele",
        description: "Caring, emotionally supportive artist",
      },
    ],
    commonTraits: ["Caring", "Supportive", "Thoughtful", "Reliable", "Warm"],
    whyThisMatch:
      "ISFJs share these celebrities' caring and supportive nature. They're thoughtful, reliable, and show care through their work. They value stability and take care of others.",
  },
  ESTJ: {
    movieStars: [
      {
        name: "Harrison Ford",
        description: "Reliable, organized action star",
      },
      {
        name: "Samuel L. Jackson",
        description: "Efficient, results-oriented actor",
      },
      {
        name: "Liam Neeson",
        description: "Organized, disciplined performer",
      },
    ],
    singers: [
      {
        name: "Madonna",
        description: "Organized, strategic businesswoman and artist",
      },
      {
        name: "Beyoncé",
        description: "Efficient, goal-oriented performer",
      },
      {
        name: "Rihanna",
        description: "Strategic, organized business leader",
      },
    ],
    commonTraits: [
      "Organized",
      "Efficient",
      "Goal-oriented",
      "Reliable",
      "Strategic",
    ],
    whyThisMatch:
      "ESTJs like these celebrities are organized leaders who value efficiency. They're goal-oriented, reliable, and prefer structured approaches. They value tradition and achievement.",
  },
  ESFJ: {
    movieStars: [
      {
        name: "Julia Roberts",
        description: "Warm, caring actress known for charm",
      },
      {
        name: "Sandra Bullock",
        description: "Supportive, social actress",
      },
      {
        name: "Reese Witherspoon",
        description: "Caring, organized performer",
      },
    ],
    singers: [
      {
        name: "Kelly Clarkson",
        description: "Warm, supportive singer",
      },
      {
        name: "Carrie Underwood",
        description: "Caring, traditional country artist",
      },
      {
        name: "Shania Twain",
        description: "Warm, social performer",
      },
    ],
    commonTraits: ["Caring", "Warm", "Social", "Organized", "Supportive"],
    whyThisMatch:
      "ESFJs share these celebrities' caring and organized nature. They're warm, social, and work to maintain harmony. They value relationships and show care through thoughtful actions.",
  },
  ISTP: {
    movieStars: [
      {
        name: "Keanu Reeves",
        description: "Cool, independent actor known for action roles",
      },
      {
        name: "Michael Fassbender",
        description: "Skilled, independent performer",
      },
      {
        name: "Ryan Gosling",
        description: "Cool, practical actor",
      },
    ],
    singers: [
      {
        name: "The Weeknd",
        description: "Independent, cool R&B artist",
      },
      {
        name: "Lana Del Rey",
        description: "Independent, cool singer-songwriter",
      },
      {
        name: "Post Malone",
        description: "Independent, practical artist",
      },
    ],
    commonTraits: [
      "Independent",
      "Cool-headed",
      "Practical",
      "Skilled",
      "Freedom-loving",
    ],
    whyThisMatch:
      "ISTPs like these celebrities are independent and skilled. They value freedom, prefer practical work, and stay cool under pressure. They're hands-on problem-solvers.",
  },
  ISFP: {
    movieStars: [
      {
        name: "Meryl Streep",
        description: "Authentic, skilled actress with artistic depth",
      },
      {
        name: "Joaquin Phoenix",
        description: "Authentic, values-driven performer",
      },
      {
        name: "Scarlett Johansson",
        description: "Creative, authentic actress",
      },
    ],
    singers: [
      {
        name: "Billie Eilish",
        description: "Authentic, creative singer-songwriter",
      },
      {
        name: "Lorde",
        description: "Authentic, artistic performer",
      },
      {
        name: "Halsey",
        description: "Creative, authentic artist",
      },
    ],
    commonTraits: [
      "Authentic",
      "Creative",
      "Artistic",
      "Values-driven",
      "Independent",
    ],
    whyThisMatch:
      "ISFPs share these celebrities' authenticity and creativity. They're artistic, values-driven, and express themselves through their work. They value personal freedom and authenticity.",
  },
  ESTP: {
    movieStars: [
      {
        name: "Brad Pitt",
        description: "Action-oriented, charismatic actor",
      },
      {
        name: "Tom Cruise",
        description: "Energetic, action-focused performer",
      },
      {
        name: "Dwayne Johnson",
        description: "Energetic, action-oriented entertainer",
      },
    ],
    singers: [
      {
        name: "Justin Timberlake",
        description: "Energetic, versatile performer",
      },
      {
        name: "Usher",
        description: "Energetic, action-oriented R&B artist",
      },
      {
        name: "Chris Brown",
        description: "Energetic, dynamic performer",
      },
    ],
    commonTraits: [
      "Action-oriented",
      "Energetic",
      "Charismatic",
      "Lives in moment",
      "Risk-taker",
    ],
    whyThisMatch:
      "ESTPs like these celebrities are action-oriented and live in the moment. They're energetic, charismatic, and enjoy taking risks. They prefer action over planning.",
  },
  ESFP: {
    movieStars: [
      {
        name: "Jennifer Lawrence",
        description: "Fun-loving, energetic actress",
      },
      {
        name: "Ryan Reynolds",
        description: "Fun, charismatic performer",
      },
      {
        name: "Margot Robbie",
        description: "Energetic, fun-loving actress",
      },
    ],
    singers: [
      {
        name: "Katy Perry",
        description: "Fun-loving, energetic pop star",
      },
      {
        name: "Miley Cyrus",
        description: "Energetic, free-spirited performer",
      },
      {
        name: "Selena Gomez",
        description: "Warm, fun-loving singer",
      },
    ],
    commonTraits: [
      "Fun-loving",
      "Energetic",
      "Social",
      "Charismatic",
      "Optimistic",
    ],
    whyThisMatch:
      "ESFPs share these celebrities' fun-loving and energetic nature. They're social, charismatic, and bring joy to others. They live in the moment and value fun experiences.",
  },
};
