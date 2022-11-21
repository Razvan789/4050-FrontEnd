import React from 'react'

interface CardContainerProps {
    children?: React.ReactNode,
    grid?: boolean
}

export default function CardContainer({ children, grid }: CardContainerProps) {


    return (
        <>
            {grid ? (
                <div className="z-10 flex flex-wrap justify-center">
                    {children}
                </div>
            ) : (
                <div className="z-20 flex items-center  overflow-x-scroll md:h-[450px] h-[350px]">
                    {children}
                </div>
            )}
        </>
    )
}

