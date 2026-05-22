import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({ children, direction = 'left', delay = 0 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a slight delay if specified, then trigger
          setTimeout(() => setInView(true), delay)
          observer.disconnect() // Only animate once
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0) scale(1)' : `translateX(${direction === 'left' ? '-80px' : '80px'}) scale(0.95)`,
        transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.1)',
        height: '100%',
        width: '100%'
      }}
    >
      {children}
    </div>
  )
}
