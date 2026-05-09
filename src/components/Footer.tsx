import Link from "next/link";

const footerLinks = {
  Lab: [
    { href: "/experiments", label: "Experiments" },
    { href: "/notes", label: "Notes" },
    { href: "/lab", label: "Community Lab" },
    { href: "/about", label: "About" },
  ],
  Resources: [
    {
      href: "https://docs.anthropic.com/en/docs/claude-code/overview",
      label: "Claude Code Docs",
      external: true,
    },
    {
      href: "https://docs.anthropic.com/en/docs/agents-and-tools/mcp",
      label: "MCP Docs",
      external: true,
    },
    {
      href: "https://www.anthropic.com/news/skills",
      label: "Agent Skills",
      external: true,
    },
    {
      href: "https://modelcontextprotocol.io",
      label: "MCP Spec",
      external: true,
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-lab-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-semibold">
                <span className="text-egg-400">Egg</span>
                <span className="text-zinc-900">thropic</span>
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              An independent experimental lab for learning Claude by building
              real experiments.
            </p>
            <p className="mt-4 text-xs text-zinc-400 leading-relaxed max-w-xs">
              Not affiliated with, endorsed by, or officially connected to
              Anthropic.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} Eggthropic. Independent project.
          </p>
          <a
            href="https://github.com/sapsaeta/eggthropic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors font-mono"
          >
            View source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
