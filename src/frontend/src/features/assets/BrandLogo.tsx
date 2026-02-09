export default function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/assets/generated/studio-logo.dim_512x512.png"
        alt="Instant Movie Director Logo"
        className="h-10 w-10 object-contain"
      />
      <span className="text-xl font-bold tracking-tight">Instant Movie Director</span>
    </div>
  );
}
