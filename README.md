# MBTI Senpai

A free, accurate MBTI (Myers-Briggs Type Indicator) personality test built with Next.js. Discover your personality type in just 10 minutes with detailed insights, compatibility analysis, and comprehensive results.

**Open-source** and available under the [MIT License](./LICENSE).

## 🌟 Features

- **Free MBTI Test** - Complete 44-question assessment
- **Accurate Scoring** - Uses weighted question analysis for precise results
- **Detailed Insights** - Comprehensive personality analysis with:
  - Type explanation and characteristics
  - Compatibility analysis
  - Deep analysis of your personality
  - Dimension narratives
  - Detailed score breakdown
- **Beautiful UI** - Modern, responsive design
- **Share Results** - Share your results via URL
- **Analytics** - Track test completions

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- Redis (optional, for analytics - falls back to file system)

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
bun run build

# Start production server
bun start
```

## 📁 Project Structure

```
mbtisenpai/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/         # API routes (questions, score, stats)
│   │   ├── test/        # Quiz page
│   │   ├── result/      # Results page
│   │   └── [pages]/     # About, Contact, Privacy, Terms
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities
│   └── mbti/            # MBTI data files
├── docs/                # Documentation (see docs/README.md)
├── data/                # Data files (test count, etc.)
└── public/              # Static assets
```

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[Documentation Index](./docs/README.md)** - Overview of all documentation
- **[Codebase Review](./docs/reviews/CODEBASE-REVIEW-2025.md)** - Latest code review
- **[Deployment Guide](./docs/deployment/DEPLOYMENT-GUIDE.md)** - How to deploy
- **[Redis Setup](./docs/deployment/REDIS-SETUP.md)** - Redis configuration

## 🛠️ Technology Stack

- **Framework:** Next.js 16.0.10 (App Router)
- **Language:** TypeScript 5
- **Runtime:** Bun
- **UI:** React 19.2.1, Tailwind CSS 4
- **Charts:** Recharts
- **Animations:** Motion (Framer Motion)
- **Storage:** Redis (with file system fallback)

## 🧪 Testing

The project includes comprehensive test suites:

```bash
# Run personality validation tests
bun test-personality-validation.js

# Run 100 test cases
bun test-100-cases.js

# Run random quiz tests
bun test-random-quizzes.js
```

See [docs/testing/](./docs/testing/) for test results.

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variables (see [Deployment Guide](./docs/deployment/DEPLOYMENT-GUIDE.md))
4. Deploy!

### Environment Variables

- `NEXT_PUBLIC_SITE_URL` - Your site URL (e.g., `https://mbtisenpai.com`)
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics ID (optional)
- `KV_REDIS_CONNECTION_STRING` or `REDIS_URL` - Redis connection string (optional)

## 📊 Scoring Algorithm

The MBTI scoring system uses weighted question analysis:

- Each question has weights for multiple MBTI dimensions
- Answers are scored on a 5-point Likert scale (-2 to +2)
- Scores are calculated as: `score[letter] += answerValue × weight`
- Multi-dichotomy effects are applied (all weights, not just primary)

See [docs/reviews/SCORING-ANALYSIS.md](./docs/reviews/SCORING-ANALYSIS.md) for detailed analysis.

## 🤝 Contributing

Contributions are welcome! This is an open-source project, and we appreciate any contributions. Please feel free to submit a Pull Request.

## 📝 License

This project is open-source and available under the [MIT License](./LICENSE).

## 👤 Author

**Khaing Myel Khant**

- LinkedIn: [khaing-myel-khant](https://www.linkedin.com/in/khaing-myel-khant-457b69146/)

## 🙏 Acknowledgments

- MBTI assessment methodology
- Next.js team for the amazing framework
- All contributors and testers

---

Made with ❤️ by Khaing Myel Khant
