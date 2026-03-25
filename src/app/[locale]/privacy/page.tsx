import { Panel, Section } from "@/components/ui";
import { getPrivacyContent } from "@/lib/content";
import type { Locale } from "@/lib/types";

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const privacy = await getPrivacyContent(typedLocale);

  return (
    <Section eyebrow="Privacy" title={privacy.headline} description="Basic legal and privacy information integrated with the rest of the platform.">
      <Panel className="space-y-5 prose-copy">
        {privacy.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Panel>
    </Section>
  );
}
