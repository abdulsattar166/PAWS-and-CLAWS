interface LogoProps {
  variant?: "dark" | "light";
  compact?: boolean;
}

export default function Logo({ variant = "dark", compact = false }: LogoProps) {
  const logoUrl = "https://static.readdy.ai/image/773d73dcd4bfe3b3ab546a821d990052/9ad574f2cfeb2d086b172f73a88209e6.png";
  const imgHeight = compact ? 40 : 52;
  const isLight = variant === "light";

  const nameColor = isLight ? "text-white" : "text-foreground-950";
  const dividerColor = isLight ? "bg-white/40" : "bg-foreground-800/50";
  const iconColor = isLight ? "text-white/70" : "text-foreground-800/70";
  const subtitleColor = isLight ? "text-white/70" : "text-foreground-800/80";

  return (
    <div className="flex items-center gap-2.5 md:gap-3 group" aria-label="Paws and Claws home">
      <img
        src={logoUrl}
        alt="Paws and Claws"
        className="object-cover rounded-full shrink-0 ring-2 ring-white/70"
        style={{ height: imgHeight, width: imgHeight }}
        loading="eager"
      />
      <div className="flex flex-col leading-none">
        <span
          className={`font-heading font-bold tracking-tight whitespace-nowrap ${nameColor} ${compact ? "text-lg" : "text-[1.35rem] md:text-[1.55rem]"}`}
        >
          PAWS AND CLAWS
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`block h-px w-4 md:w-6 ${dividerColor}`} />
          <i className={`ri-footprint-line text-[10px] md:text-xs ${iconColor}`} aria-hidden="true"></i>
          <span className={`block h-px w-4 md:w-6 ${dividerColor}`} />
        </div>
        <span
          className={`font-label font-medium tracking-[0.18em] uppercase whitespace-nowrap mt-0.5 ${subtitleColor} ${compact ? "text-[0.55rem]" : "text-[0.6rem] md:text-[0.65rem]"}`}
        >
          Mobile Pet Grooming Salon LLC
        </span>
      </div>
    </div>
  );
}