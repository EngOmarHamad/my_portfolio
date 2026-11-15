import { About } from '@/portfolio/components/home/About'
import { Skills } from '@/portfolio/components/home/Skills'
import { Work } from '@/portfolio/components/work/Work'
import { Experience } from '@/portfolio/components/home/Experience'
import { Contact } from '@/portfolio/components/contact/Contact'

/** Everything below the fold — loaded as one chunk right after the hero. */
export default function HomeSections() {
  return (
    <>
      <About />
      <Skills />
      <Work />
      <Experience />
      <Contact />
    </>
  )
}
