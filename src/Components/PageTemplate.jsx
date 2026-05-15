function PageTemplate({
  eyebrow,
  title,
  description,
  action,
  stats = [],
  children,
  contentClassName = "",
}) {
  return (
    <div className="h-full overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className={`mx-auto flex min-h-full w-full max-w-7xl flex-col gap-5 pb-8 sm:pb-10 ${contentClassName}`}>
        <section className="grid gap-5 rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                {description}
              </p>
            )}
          </div>

          {(action || stats.length > 0) && (
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center lg:justify-end">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3"
                >
                  <p className="truncate text-lg font-semibold text-cyan-100 sm:text-xl">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
              {action}
            </div>
          )}
        </section>

        {children}
      </div>
    </div>
  );
}

export default PageTemplate;
