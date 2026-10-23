import { useEffect } from 'react'
import { StatusProvider } from './components/ui/status'
import { Header } from './components/Header'
import { MobileBar } from './components/MobileBar'
import { Preloader } from './components/chapters/Preloader'
import { Hero } from './components/chapters/Hero'
import { PubBuilds } from './components/chapters/PubBuilds'
import { PubClassics } from './components/chapters/PubClassics'
import { TheCraic } from './components/chapters/TheCraic'
import { Gallery } from './components/chapters/Gallery'
import { GiftCards } from './components/chapters/GiftCards'
import { FreshLoaf } from './components/chapters/FreshLoaf'
import { Reviews } from './components/chapters/Reviews'
import { Visit } from './components/chapters/Visit'
import { Footer } from './components/chapters/Footer'
import { initSmoothScroll } from './lib/scroll'
import { initCtaTracking } from './lib/analytics'

export default function App() {
  useEffect(() => {
    const stopScroll = initSmoothScroll()
    const stopTracking = initCtaTracking()
    return () => {
      stopScroll()
      stopTracking()
    }
  }, [])

  return (
    <StatusProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brass-500 focus:px-4 focus:py-2 focus:text-stout-900">
        Skip to content
      </a>
      <Preloader />
      <Header />
      <main id="main">
        <Hero />
        <PubBuilds />
        <PubClassics />
        <TheCraic />
        <Gallery />
        <GiftCards />
        <FreshLoaf />
        <Reviews />
        <Visit />
      </main>
      <Footer />
      <MobileBar />
    </StatusProvider>
  )
}
