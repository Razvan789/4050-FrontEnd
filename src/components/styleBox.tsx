import React, { Children } from 'react'

interface StyleBoxProps {
    children: React.ReactNode
    className?: string
}

export default function StyleBox({children, className} : StyleBoxProps) {
  return (
    <div className={className + " rounded-xl border-2 border-purple-300 w-[400px] mx-auto my-10 p-3 pt-0 bg-slate-900"}>
      {children}
    </div>
  )
}
