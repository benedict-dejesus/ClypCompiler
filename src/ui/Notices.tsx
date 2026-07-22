import { useStore } from '../store/store'

export function Notices() {
  const notices = useStore((s) => s.notices)
  const dismiss = useStore((s) => s.dismissNotice)
  if (notices.length === 0) return null
  return (
    <div className="notices">
      {notices.map((n) => (
        <div key={n.id} className={`notice notice-${n.kind}`} onClick={() => dismiss(n.id)}>
          {n.text}
        </div>
      ))}
    </div>
  )
}
