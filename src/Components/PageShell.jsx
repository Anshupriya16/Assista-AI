function PageShell({ children, pageBg, className = "", contentClassName = "" }) {
  const backgroundImage = pageBg
    ? `url(${pageBg}), radial-gradient(circle at top left, rgba(34,211,238,0.2), transparent 28%), radial-gradient(circle at bottom right, rgba(168,85,247,0.18), transparent 28%), linear-gradient(to bottom right, #080d17, #121426)`
    : "linear-gradient(135deg, #080d17 0%, #0b1220 46%, #121426 100%)";

  return (
    <div
      className={`relative h-full w-full overflow-y-auto text-white ${className}`}
      style={{
        backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute inset-0 bg-black/35" />
      <div className={`relative z-10 mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8 lg:py-10 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}

export default PageShell;
