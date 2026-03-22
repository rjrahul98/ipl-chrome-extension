import type { Team } from '../../shared/types'

interface Props {
  team: Team
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 28, md: 36, lg: 48 }

export default function TeamLogo({ team, size = 'md' }: Props) {
  const px = sizeMap[size]

  if (team.logo) {
    return (
      <img
        src={team.logo}
        alt={team.short}
        width={px}
        height={px}
        className="rounded-full object-cover"
        style={{ width: px, height: px }}
      />
    )
  }

  // Fallback: colored circle with initials
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold text-white"
      style={{
        width: px,
        height: px,
        background: team.color,
        fontSize: px * 0.32,
        flexShrink: 0,
      }}
    >
      {team.short.slice(0, 2)}
    </div>
  )
}
