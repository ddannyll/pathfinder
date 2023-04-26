import { useState } from 'react'
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
    onMouseActiveOverCell: (position: Coordinate) => void
}

export function Grid ({width, height, start, end, walls, searched, currSearching, path, onMouseActiveOverCell}: GridProps) {
    const [mouseDown, setMouseDown] = useState(false)

    const handleMouseOverCell = (coordinate: Coordinate) => {
        if (mouseDown) {
            onMouseActiveOverCell(coordinate)
        }
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
                onMouseDown={() => onMouseActiveOverCell(currCoordiante)}
                onMouseOver={() => handleMouseOverCell(currCoordiante)}
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
        className="inline-grid w-fit border"
        style={{gridTemplateColumns: `repeat(${width}, 1fr)`}}>
        {cells}
    </div>)
}
