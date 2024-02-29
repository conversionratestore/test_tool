console.log(
  '%c EXP: Trial Selection (DEV: YK)',
  'background: #3498eb; color: #fccf3a; font-size: 20px; font-weight: bold;'
)
const $$el = selector => document.querySelectorAll(selector)
const $el = selector => document.querySelector(selector)
const git = 'https://conversionratestore.github.io/projects/'

// funtion for push data to GA4
const pushDataLayer = (name, desc, type = '', loc = '') => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'event-to-ga4',
    event_name: name,
    event_desc: desc,
    event_type: type,
    event_loc: loc
  })
  console.log(`Event: ${name} ${desc} ${type} ${loc}`)
}

// load script
const loadScriptOrStyle = url => {
  return new Promise((resolve, reject) => {
    // check script by document.scripts
    const type = url.split('.').pop()
    if (type === 'js') {
      const loadedScripts = Array.from(document.scripts).map(script => script.src.toLowerCase())
      if (loadedScripts.includes(url.toLowerCase())) {
        console.log(`Script ${url} allready downloaded!`)
        return resolve('')
      }
      const script = document.createElement('script')
      script.src = url
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    } else if (type === 'css') {
      const loadedStyles = Array.from(document.styleSheets).map(style => style.href.toLowerCase())
      if (loadedStyles.includes(url.toLowerCase())) {
        console.log(`Style ${url} allready downloaded!`)
        return resolve('')
      }
      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = url
      style.onload = resolve
      style.onerror = reject
      document.head.appendChild(style)
    }
  })
}
// load list of scripts
const loadScriptsOrStyles = async urls => {
  for (const url of urls) {
    await loadScriptOrStyle(url)
    console.log(`Loaded librari ${url}`)
  }
  console.log('All libraries loaded!')
}

// clarity script
const clarityInterval = setInterval(function () {
  if (typeof clarity == 'function') {
    clearInterval(clarityInterval)
    clarity('set', '', 'variant_1')
  }
}, 1000)

// scroll depth
const scrollDepth = () => {
  const scrollTop = window.scrollY
  const winHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight
  const totalDocScrollLength = docHeight - winHeight
  const scrollPercent = (scrollTop / totalDocScrollLength) * 100
  return Math.round(scrollPercent)
}

// max scroll depth
const maxScrollDepth = () => {
  let maxScrollDepth = 0

  function trackScrollDepth() {
    const scrolled = window.scrollY
    const windowHeight = window.innerHeight
    const pageHeight = document.documentElement.scrollHeight
    const currentDepth = ((scrolled + windowHeight) / pageHeight) * 100
    if (currentDepth >= maxScrollDepth + 5) {
      maxScrollDepth = Math.round(currentDepth / 5) * 5
      pushDataLayer('scroll', `${maxScrollDepth}%`, 'Scroll depth', 'Page')
    }
    if (currentDepth >= 100) {
      window.removeEventListener('scroll', trackScrollDepth)
    }
  }

  window.addEventListener('scroll', trackScrollDepth)
}

// block visibility function
const blockVisibility = (selector, viewTime, event, location) => {
  let v1 = new IntersectionObserver(
    entries => {
      entries.forEach(item => {
        if (item.isIntersecting) {
          v1.unobserve(item.target)
          setTimeout(function () {
            v2.observe(item.target)
          }, 1000 * viewTime)
        }
      })
    },
    {
      threshold: 0.5
    }
  )

  let v2 = new IntersectionObserver(entries => {
    entries.forEach(item => {
      if (item.isIntersecting) {
        pushDataLayer(
          event || `view_element_${item.target.id}`,
          'Element visibility',
          `View element on screen (${viewTime} sec or more)`,
          location || item.target.id
        )
        v1.unobserve(item.target)
      } else {
        v1.observe(item.target)
      }
      v2.unobserve(item.target)
    })
  })

  document.querySelectorAll(selector).forEach(item => {
    v1.observe(item)
  })
}

// visible time of block on viewport

function checkFocusTime(selector, event, location) {
  const checker = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.getAttribute('data-startShow')) {
        entry.target.setAttribute('data-startShow', new Date().getTime())
      } else if (!entry.isIntersecting && entry.target.getAttribute('data-startShow')) {
        const startShow = entry.target.getAttribute('data-startShow')
        const endShow = new Date().getTime()
        const timeShow = Math.round((endShow - startShow) / 1000)
        entry.target.removeAttribute('data-startShow')
        pushDataLayer(event, timeShow, 'Visibility', location)
        checker.unobserve(entry.target)
      }
    })
  })

  checker.observe(document.querySelector(selector))
}

// check new user

getNewUser('_ga')
function getNewUser(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  let valueCookie
  let timeNewUser
  if (parts.length === 2) {
    valueCookie = parts.pop().split(';').shift()
    timeNewUser = +(valueCookie.split('.').pop() + '000')
    if (+new Date() - +new Date(timeNewUser) <= 5 * 60 * 1000) {
      console.log(`New User`)
    } else {
      console.log(new Date(timeNewUser))
    }
  }
}

// smoth scroll to element

function scrollToElement(selector, time) {
  const element = document.querySelector(selector)
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition - 100
  window.scrollBy({
    top: offsetPosition,
    behavior: 'smooth'
  })
}
