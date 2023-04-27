import React, { useState } from 'react'
import { coordinateInArray, coordinatesEqual } from '../../helpers'
import { GridCell, GridCellTypes } from './GridCell'

export interface Coordinate {
    x: number
    y: number
}

export interface GridProps {
    width: number
    height: number
    start: Coordinate
    end: Coordinate
    walls: Coordinate[]
    searched: Coordinate[]
    currSearching?: Coordinate
    path: Coordinate[]
    className?: string
    onMouseActiveOverCell: (position: Coordinate) => void
    onCellClick?: (position: Coordinate) => void
    movingElement?: 'start' | 'end'
}

export function Grid ({
    width,
    height,
    start,
    end,
    walls,
    searched,
    currSearching,
    path,
    onMouseActiveOverCell,
    className = '',
    onCellClick,
    movingElement}: GridProps)
{
    const [mouseDown, setMouseDown] = useState(false)
    const handleMouseOverCell = (coordinate: Coordinate) => {
        if (mouseDown) {
            onMouseActiveOverCell(coordinate)
        }
    }
    let hoverClasses = ''
    if (movingElement === 'start') {
        hoverClasses = 'hover:bg-blue-300'
    } else if (movingElement === 'end') {
        hoverClasses = 'hover:bg-red-300'
    }

    const cells: React.ReactNode[] = []
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const currCoordiante = {x: j, y: i}
            let type: GridCellTypes = 'empty'
            if (currSearching && coordinatesEqual(currSearching, currCoordiante)) {
                type = 'current'
            } else if (coordinatesEqual(start, currCoordiante)) {
                type = 'start'
            } else if (coordinatesEqual(end, currCoordiante)) {
                type = 'end'
            } else if (coordinateInArray(walls, currCoordiante)) {
                type = 'wall'
            } else if (coordinateInArray(path, currCoordiante)) {
                type = 'path'
            } else if (coordinateInArray(searched, currCoordiante)) {
                type = 'searched'
            }
            cells.push(<GridCell
                x={j}
                y={i}
                onClick={onCellClick ? () => onCellClick(currCoordiante) : undefined}
                onMouseDown={type === 'empty' || type === 'wall' ? () => onMouseActiveOverCell(currCoordiante) : undefined}
                onMouseOver={() => handleMouseOverCell(currCoordiante)}
                className={hoverClasses}
                type={type}
                key={`${j} ${i}`}/>
            )
        }
    }

    return (<div
        onMouseDown={(e) => {
            e.preventDefault()
            setMouseDown(true)
        }}
        onMouseUp={() => setMouseDown(false)}
        onMouseLeave={() => setMouseDown(false)}
        className={`grid border ${className}`}
        style={{gridTemplateColumns: `repeat(${width}, 1fr)`, gridTemplateRows: `repeat(${height}, 1fr)`}}>
        {cells}
    </div>)
}
