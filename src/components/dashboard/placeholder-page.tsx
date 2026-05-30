interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="px-6 py-5">
      <header className="border-b border-border pb-4">
        <h1 className="font-heading text-xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="mt-8 border border-dashed border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Module connected to live dispatch backend when deployed.
        </p>
      </div>
    </div>
  );
}
