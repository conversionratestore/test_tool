declare global {
  interface Window {
    dataLayer: any[]
  }
}

interface DataLayer {
  name: string
  desc: string
  type?: 'click' | 'view' | 'submit' | 'input' | 'change' | 'error' | 'success' | 'other'
  loc?: string
}

export const pushData = ({ name, desc, type = 'click', loc = '' }: DataLayer) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'event-to-ga4',
    event_name: name,
    event_desc: desc,
    event_type: type,
    event_loc: loc
  })
  console.log(`Event: ${name} | ${desc} | ${type} | ${loc}`)
}

interface StartLog {
  name: string
  dev: string
}

export const startLog = ({ name, dev }: StartLog) => {
  console.log(
    `%c EXP: ${name} (DEV: ${dev})`,
    `background: #3498eb; color: #fccf3a; font-size: 20px; font-weight: bold;`
  )
}

export const $$el = selector => document.querySelectorAll(selector)
export const $el = selector => document.querySelector(selector)
