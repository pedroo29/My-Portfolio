import { CTAButton, Panel, Section } from "@/components/ui";
import { availabilityLabels } from "@/lib/constants";
import { getContactContent } from "@/lib/content";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const contact = await getContactContent(typedLocale);

  return (
    <div className="space-y-10">
      <Section eyebrow="Contact" title={contact.content.headline} description={contact.content.intro}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Panel className="space-y-2 bg-slate-950/70">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Email</p>
                <a href={`mailto:${contact.channels.email}`} className="text-sm text-cyan-200 hover:text-cyan-100">
                  {contact.channels.email}
                </a>
              </Panel>
              <Panel className="space-y-2 bg-slate-950/70">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">LinkedIn</p>
                <a href={contact.channels.linkedin} className="text-sm text-cyan-200 hover:text-cyan-100">
                  {contact.channels.linkedin}
                </a>
              </Panel>
              <Panel className="space-y-2 bg-slate-950/70">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">GitHub</p>
                <a href={contact.channels.github} className="text-sm text-cyan-200 hover:text-cyan-100">
                  {contact.channels.github}
                </a>
              </Panel>
              <Panel className="space-y-2 bg-slate-950/70">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Availability</p>
                <p className="text-sm text-slate-100">{availabilityLabels[contact.channels.availability]}</p>
              </Panel>
            </div>
          </Panel>
          <Panel className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-50">Context</h2>
            <div className="space-y-4 text-sm text-slate-300">
              <p>Location: {contact.content.location}</p>
              <p>Preferred channel: {contact.content.preferredChannel}</p>
              <p>Expected response time: {contact.content.responseTime}</p>
            </div>
            <CTAButton href={`mailto:${contact.channels.email}`}>{contact.content.primaryCtaLabel}</CTAButton>
          </Panel>
        </div>
      </Section>
    </div>
  );
}
