import { useEffect } from 'react'
import { useStore } from './store/store'
import { StartScreen } from './ui/StartScreen'
import { BuilderScreen } from './ui/BuilderScreen'
import { PlayerScreen } from './ui/PlayerScreen'
import { Notices } from './ui/Notices'

export function App() {
  const view = useStore((s) => s.view)
  const refreshProjects = useStore((s) => s.refreshProjects)

  useEffect(() => {
    void refreshProjects()
  }, [refreshProjects])

  return (
    <div className="app">
      {view === 'start' && <StartScreen />}
      {view === 'builder' && <BuilderScreen />}
      {view === 'player' && <PlayerScreen />}
      <Notices />
    </div>
  )
}
