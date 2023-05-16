export type GridCellTypes = 'start' | 'end' | 'wall' | 'searched' | 'empty' | 'current' | 'path' | 'currentVisited'

interface GridCellProps {
    x: number
    y: number
    children?: React.ReactNode
    className?: string
    type?: GridCellTypes
    onMouseOver?: () => void
    onMouseDown?: () => void
    onMouseUp?: () => void
    onClick?: () => void
    label?: string
}

export function GridCell({children, className = '', type = 'empty', onMouseOver, onMouseDown, onClick, onMouseUp, x, y, label=''}: GridCellProps) {
    let styleClasses = ''
    let labelTextColor = 'text-black'
    if (!className) {
        if (type === 'empty') {
            styleClasses = 'bg-zinc-50'
        } else if (type === 'current') {
            styleClasses = 'bg-amber-300'
        } else if (type === 'start') {
            styleClasses = 'bg-blue-500'
        } else if (type === 'wall') {
            styleClasses = 'bg-zinc-700'
            labelTextColor = 'text-white'
        } else if (type === 'searched') {
            styleClasses = 'bg-zinc-300 transition'
        } else if (type === 'end') {
            styleClasses = 'bg-red-400'
        } else if (type === 'path') {
            styleClasses = 'bg-green-400 transition'
        }
    }


    return <div
        data-x={x}
        data-y={y}
        onClick={onClick}
        onMouseDown={(e) => {
            e.preventDefault()
            if (onMouseDown) {
                onMouseDown()
            }
        }}
        onMouseUp={onMouseUp}
        onMouseOver={onMouseOver}
        className={`border aspect-square relative ${styleClasses} ${className}`}>
        <div className={`absolute w-full h-full flex justify-center items-center text-xs font-mono cursor-default ${labelTextColor}`}>{label}</div>
        {children}
    </div>
}
