import Link from "next/link";

const features = [
  {
    href: "/algorithms",
    title: "Algorithms",
    description:
      "Run Two Sum, Binary Search, Remove Element and more. Compare all solving methods with live benchmarks.",
    badge: "Execute",
  },
  {
    href: "/big-o",
    title: "Big O Analysis",
    description:
      "Paste any code snippet and get its time and space complexity — via static AST analysis or AI.",
    badge: "Analyze",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-16 pt-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Big<span className="text-indigo-400">DSA</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl">
          Interactive platform to explore DSA patterns and analyze algorithm
          complexity. Big O always matters.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-indigo-500 transition-colors"
          >
            <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded mb-3">
              {f.badge}
            </span>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-300 transition-colors">
              {f.title}
            </h2>
            <p className="text-zinc-400 text-sm">{f.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
