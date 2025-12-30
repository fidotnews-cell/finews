"use client"

import * as React from "react"

export function TimeAgo({ dateString }: { dateString: string }) {
  const [timeLabel, setTimeLabel] = React.useState("")

  React.useEffect(() => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

    if (diffInMinutes < 60) {
      setTimeLabel(`${diffInMinutes}min`)
    } else {
      const hours = Math.floor(diffInMinutes / 60)
      setTimeLabel(`${hours}h`)
    }
  }, [dateString])

  return (
    <span className="text-gray-500 dark:text-gray-400 font-mono text-xs w-12 shrink-0">
      {timeLabel || '--'}
    </span>
  )
}
