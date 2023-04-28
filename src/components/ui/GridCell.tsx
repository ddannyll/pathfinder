export type GridCellTypes = 'start' | 'end' | 'wall' | 'searched' | 'empty' | 'current' | 'path'

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
}

export function GridCell({children, className = '', type = 'empty', onMouseOver, onMouseDown, onClick, onMouseUp, x, y}: GridCellProps) {
    let styleClasses = ''
    if (!className) {
        if (type === 'empty') {
            styleClasses = 'bg-zinc-50'
        } else if (type === 'current') {
            styleClasses = 'bg-amber-300'
        } else if (type === 'start') {
            styleClasses = 'bg-blue-500'
        } else if (type === 'wall') {
            styleClasses = 'bg-zinc-700'
        } else if (type === 'searched') {
            styleClasses = 'bg-zinc-300 transition'
        } else if (type === 'end') {
            styleClasses = 'bg-red-500'
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
        className={`border aspect-square ${styleClasses} ${className}`}>
        {children}
    </div>
}
