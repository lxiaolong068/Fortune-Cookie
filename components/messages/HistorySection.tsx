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
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-amber-100 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-100 rounded-full">
            <Scroll className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            History & Psychology Behind Fortune Cookie Messages
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* History */}
          <div className="prose prose-lg text-gray-700">
            <p>
              While often associated with Chinese cuisine in Western
              culture, the{" "}
              <Link
                href="/history"
                className="text-amber-600 hover:text-amber-700 font-medium"
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
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                who invented fortune cookies
              </Link>
              .
            </p>
          </div>

          {/* Psychology */}
          <div className="prose prose-lg text-gray-700">
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
        <div className="bg-gradient-to-br from-purple-50 to-amber-50 p-6 rounded-2xl border border-purple-100">
          <h3 className="text-lg font-bold text-purple-900 mb-4">
            Did You Know?
          </h3>
          <ul className="space-y-3">
            {funFacts.map((fact, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <fact.icon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">
                    {fact.title}:
                  </strong>{" "}
                  <span className="text-gray-600">{fact.content}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
