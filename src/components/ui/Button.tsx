import React from 'react'

interface ButtonProps {
    children?: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
    type?: 'primary' | 'secondary'
    className?: string
}

export function Button ({children, onClick, disabled, type = 'primary', className=''}: ButtonProps) {
    let styleClasses = 'bg-indigo-500 text-white active:bg-indigo-600 disabled:bg-indigo-300'

    if (type === 'secondary') {
        styleClasses = 'text-indigo-500'
    }

    return <button
        disabled={disabled}
        onClick={onClick}
        className={`px-6 py-2 border border-indigo-500 rounded ${styleClasses} ${className}`}>
        {children}
    </button>
}