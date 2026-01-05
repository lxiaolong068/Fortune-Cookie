import { Scroll, Globe, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

const funFacts = [
  {
    title: "Not Actually Chinese",
    content:
      "Fortune cookies likely originated in Japan, not China. A Japanese cracker called 'tsujiura senbei' dates back to 19th-century Kyoto.",
    icon: Globe,
  },
  {
    title: "Billions Served",
    content:
      "Approximately 3 billion fortune cookies are produced globally every year, with the vast majority consumed in the United States.",
    icon: TrendingUp,
  },
  {
    title: "Lottery Winners",
    content:
      "A surprising number of people have won lottery jackpots by playing the 'lucky numbers' found on the back of their fortune cookie slips!",
    icon: Sparkles,
  },
];

/**
 * HistorySection - History & Psychology section for the messages page
 *
 * Contains:
 * - Brief history of fortune cookies
 * - Psychology explanation (Barnum Effect)
 * - Fun facts with icons
 * - Internal links to related pages
 */
export function HistorySection() {
  return (
    <section className="mt-24 max-w-5xl mx-auto">
      <div className="rounded-3xl border border-[#FFE4D6] bg-white p-8 shadow-lg md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-full bg-[#FFE4D6] p-3">
            <Scroll className="h-8 w-8 text-[#E55328]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222]">
            History & Psychology Behind Fortune Cookie Messages
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* History */}
          <div className="prose prose-lg text-[#555555]">
            <p>
              While often associated with Chinese cuisine in Western
              culture, the{" "}
              <Link
                href="/history"
                className="font-medium text-[#FF6B3D] hover:text-[#E55328] hover:underline"
              >
                fortune cookie history
              </Link>{" "}
              actually traces back to{" "}
              <strong>19th-century Japan</strong>. A similar cracker
              called <em>&quot;tsujiura senbei&quot;</em> was sold in
              Kyoto with paper fortunes tucked inside. The modern,
              vanilla-sweetened version was popularized in California in
              the early 20th century. Learn more about{" "}
              <Link
                href="/who-invented-fortune-cookies"
                className="font-medium text-[#FF6B3D] hover:text-[#E55328] hover:underline"
              >
                who invented fortune cookies
              </Link>
              .
            </p>
          </div>

          {/* Psychology */}
          <div className="prose prose-lg text-[#555555]">
            <p>
              The appeal of fortune cookies is linked to the{" "}
              <strong>Barnum Effect</strong>—a psychological phenomenon
              where individuals believe vague, general statements apply
              specifically to them. The positive, open-ended nature of
              fortune cookie messages allows us to project our hopes and
              dreams onto the text, creating a moment of personal
              connection and delight.
            </p>
          </div>
        </div>

        {/* Did You Know */}
        <div className="rounded-2xl border border-[#FFE4D6] bg-[#FAFAFA] p-6">
          <h3 className="text-lg font-bold text-[#222222] mb-4">
            Did You Know?
          </h3>
          <ul className="space-y-3">
            {funFacts.map((fact, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <fact.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#FF6B3D]" />
                <div>
                  <strong className="text-[#222222]">
                    {fact.title}:
                  </strong>{" "}
                  <span className="text-[#555555]">{fact.content}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
