import Image from "next/image";

interface ProfileImageProps {
  size?: string; // Tailwind size class like "w-10 h-10", "w-16 h-16", "w-32 h-32"
  thickness?: number;
}

export default function ProfileImage({
  size = "w-16 h-16",
}: ProfileImageProps) {
  return (
    <div>
      <Image
        src="/logo.png"
        alt="MBTI Senpai"
        width={100}
        height={100}
        className={`${size} rounded-full`}
      />
    </div>
  );
}
