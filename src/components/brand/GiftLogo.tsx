export default function GiftLogo({ small = false }: { small?: boolean }) {
  const size = small ? 34 : 42;
  const box = small ? 18 : 22;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex shrink-0 items-center justify-center rounded-2xl shadow-sm"
        style={{
          width: size,
          height: size,
          background:
            "linear-gradient(135deg, #f9a8d4 0%, #ec4899 45%, #be185d 100%)",
        }}
        aria-hidden="true"
      >
        <svg width={box} height={box} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="10" width="16" height="10" rx="2.2" fill="white" />
          <rect x="3" y="7" width="18" height="4.5" rx="2.2" fill="#ffe4ef" />
          <path d="M12 7V20" stroke="#be185d" strokeWidth="1.8" />
          <path d="M4 14H20" stroke="#f9a8d4" strokeWidth="1.4" />
          <path
            d="M12 7C10.5 7 9.1 6.1 9.1 4.8C9.1 3.8 9.9 3 11 3C12.2 3 12.8 4 12 7Z"
            fill="white"
          />
          <path
            d="M12 7C13.5 7 14.9 6.1 14.9 4.8C14.9 3.8 14.1 3 13 3C11.8 3 11.2 4 12 7Z"
            fill="#fff1f7"
          />
        </svg>
      </div>

      <span className="whitespace-nowrap text-2xl font-extrabold tracking-tight text-[#b83280]">
        NeAlsam
      </span>
    </div>
  );
}
