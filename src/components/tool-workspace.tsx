import type { ReactNode } from "react";
import { FixMyTechShell, SectionHeading } from "@/components/fixmytech-shell";

export function ToolWorkspace({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <FixMyTechShell>
      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-10">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {children}
      </main>
    </FixMyTechShell>
  );
}

export function WorkspacePanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="instrument-card rounded-3xl p-5 sm:p-6">
      <h2 className="font-display text-xl font-extrabold">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-soft">{description}</p>
      {children}
    </section>
  );
}