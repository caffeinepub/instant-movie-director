interface RoleIconProps {
  role: string;
  className?: string;
}

const rolePositions: Record<string, { x: number; y: number }> = {
  Director: { x: 0, y: 0 },
  Screenwriter: { x: 512, y: 0 },
  Cinematographer: { x: 0, y: 512 },
  Producer: { x: 512, y: 512 },
  Editor: { x: 0, y: 1024 },
  Sound: { x: 512, y: 1024 },
};

export default function RoleIcon({ role, className = '' }: RoleIconProps) {
  const position = rolePositions[role] || { x: 0, y: 0 };
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: '48px', height: '48px' }}>
      <img
        src="/assets/generated/role-icons-set.dim_1024x1024.png"
        alt={`${role} icon`}
        className="absolute"
        style={{
          width: '1024px',
          height: '1536px',
          left: `-${position.x}px`,
          top: `-${position.y}px`,
          objectFit: 'none',
        }}
      />
    </div>
  );
}
