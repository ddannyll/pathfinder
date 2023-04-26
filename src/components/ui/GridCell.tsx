export type GridCellTypes = 'start' | 'end' | 'wall' | 'searched' | 'empty' | 'current' | 'path'

interface GridCellProps {
    children?: React.ReactNode
    className?: string
    type?: GridCellTypes
    onMouseOver?: () => void
    onMouseDown?: () => void
}

export function GridCell({children, className = '', type = 'empty', onMouseOver, onMouseDown}: GridCellProps) {
    let styleClasses = ''
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

    return <div
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
        className={`border ${styleClasses} ${className}`}>
        {children}
    </div>
}
