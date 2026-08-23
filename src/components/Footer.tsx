import Link from "next/link";

const footerLinks = {
  Laboratorio: [
    { href: "/experiments", label: "Experimentos" },
    { href: "/notes", label: "Notas" },
    { href: "/lab", label: "Laboratorio comunitario" },
    { href: "/sap", label: "SAP x Claude Lab" },
    { href: "/about", label: "Sobre el lab" },
  ],
  Recursos: [
    {
      href: "https://docs.anthropic.com/en/docs/claude-code/overview",
      label: "Docs de Claude Code",
      external: true,
    },
    {
      href: "https://docs.anthropic.com/en/docs/agents-and-tools/mcp",
      label: "Docs de MCP",
      external: true,
    },
    {
      href: "https://www.anthropic.com/news/skills",
      label: "Agent Skills",
      external: true,
    },
    {
      href: "https://modelcontextprotocol.io",
      label: "Especificación MCP",
      external: true,
    },
    {
      href: "https://saetaia.com",
      label: "SaetaIA — Claude × SAP en español",
      external: true,
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-paper-line bg-paper-deep/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-semibold">
                <span className="text-egg-600">Egg</span>
                <span className="text-ink">thropic</span>
              </span>
            </div>
            <p className="text-sm text-ink-faint leading-relaxed max-w-xs">
              Un laboratorio experimental independiente para aprender Claude construyendo
              experimentos reales.
            </p>
            <p className="mt-4 text-xs text-ink-faint leading-relaxed max-w-xs">
              Sin afiliación, respaldo ni conexión oficial con
              Anthropic.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-mono tracking-widest text-ink-faint uppercase mb-4">
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
                        className="text-sm text-ink-soft hover:text-ink transition-colors"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-ink-soft hover:text-ink transition-colors"
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
        <div className="border-t border-paper-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} Eggthropic. Independent project.
          </p>
          <a
            href="https://github.com/sapsaeta/eggthropic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ink-faint hover:text-ink transition-colors font-mono"
          >
            Ver el código en GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
