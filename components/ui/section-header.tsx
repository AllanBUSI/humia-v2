interface SectionHeaderProps {
  tag?: string;
  title: React.ReactNode;
  description?: string;
}

export function SectionHeader({ tag, title, description }: SectionHeaderProps) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {tag && (
        <p className="mb-3 text-sm font-medium text-[#1b17ff]">{tag}</p>
      )}
      <h2 className="mb-4 text-3xl font-semibold tracking-tight text-[#0f172a]">
        {title}
      </h2>
      {description && (
        <p className="text-[#0f172a]/60">{description}</p>
      )}
    </div>
  );
}
