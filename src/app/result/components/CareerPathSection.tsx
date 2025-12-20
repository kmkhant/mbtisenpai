"use client";

import { Briefcase, Building2, Target, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CAREER_PATH_DATA } from "../data/career-path";

interface CareerPathSectionProps {
  type: string;
}

export function CareerPathSection({ type }: CareerPathSectionProps) {
  const careerData = CAREER_PATH_DATA[type];
  if (!careerData) return null;

  return (
    <section className="mt-8 space-y-4 text-xs text-muted-foreground sm:text-sm">
      <p className="font-semibold capitalize text-pink-500 flex items-center gap-2">
        <Briefcase className="h-5 w-5" />
        MBTI Test for Career Path
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-emerald-50/60 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-emerald-800">
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
              Ideal Careers
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-emerald-700">
              Career paths that align with your personality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {careerData.idealCareers.map((career) => (
                <span
                  key={career}
                  className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 sm:text-sm"
                >
                  {career}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/60 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-blue-800">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Ideal Work Environments
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-blue-700">
              Work settings where you thrive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {careerData.workEnvironments.map((env, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-blue-700">
                  • {env}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-green-50/60 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base text-green-800">
              Career Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {careerData.careerStrengths.map((strength, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-green-700">
                  • {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-rose-50/60 border-rose-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-rose-800">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              Career Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {careerData.careerChallenges.map((challenge, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-rose-700">
                  • {challenge}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-indigo-50/60 border-indigo-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-indigo-800">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
            Career Advice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-indigo-700">
            {careerData.careerAdvice}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
