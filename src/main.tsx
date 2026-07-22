import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { useStore } from './store/store'
import { exportCourseZip, buildPreviewHtml } from './export/zip'
import './styles.css'

// Console/automation hook: lets power users script imports and exports
// (window.__cc.store.getState()...). Harmless to leave in production builds.
;(window as unknown as Record<string, unknown>).__cc = {
  store: useStore,
  exportCourseZip,
  buildPreviewHtml
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
