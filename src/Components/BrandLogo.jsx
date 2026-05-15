import assistaLogo from "../images/Assistalogo.png";

function BrandLogo({ className = "h-9 w-9", imageClassName = "h-full w-full" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-200/20 bg-[#080d17]/60 shadow-lg shadow-cyan-950/30 ${className}`}
    >
      <img
        src={assistaLogo}
        alt="Assista AI logo"
        className={`object-cover ${imageClassName}`}
      />
    </span>
  );
}

export default BrandLogo;
