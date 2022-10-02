import React, { Children } from 'react'

interface StyleBoxProps {
    children: React.ReactNode
    className?: string
}

export default function StyleBox({children, className} : StyleBoxProps) {
  return (
    <div className={className + " rounded-xl border-2 border-primary w-[400px] lg:w-[700px] mx-auto my-10 p-3 pt-0 bg-slate-900"}>
      {children}
    </div>
  )
}
