import { FaDev, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaMedium, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { Link2 } from 'lucide-react'
import type { SocialPlatform } from '@/portfolio/data/types'

const ICONS: Record<SocialPlatform, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  facebook: FaFacebook,
  medium: FaMedium,
  dev: FaDev,
  other: Link2,
}

export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const Icon = ICONS[platform]
  return <Icon className={className} aria-hidden />
}
