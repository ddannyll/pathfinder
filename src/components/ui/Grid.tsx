import React, { useCallback, useEffect, useState } from 'react'
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
    toBeSearched?:Coordinate[]
    searched?: Coordinate[]
    currSearching?: Coordinate
    currSearchingVisited?: boolean
    path?: Coordinate[]
    className?: string
    disableInteractions?: boolean
    alphaRepresentationList: string[]
    setStart: React.Dispatch<Coordinate>
    setEnd: React.Dispatch<Coordinate>
    setWalls: React.Dispatch<Coordinate[]>
}


export function Grid ({
    width,
    height,
    start,
    end,
    walls,
    searched,
    currSearching,
    toBeSearched,
    path,
    disableInteractions = false,
    alphaRepresentationList,
    className = '',
    setStart,
    setEnd,
    setWalls,
}: GridProps) {
    const [brushing, setBrushing] = useState(false)
    const [brushingWalls, setBrushingWalls] = useState(true)
    const [overCell, setOverCell] = useState<Coordinate|null>(null)
    const [placing, setPlacing] = useState<'start' | 'end' | null>(null)

    useEffect(() => {
        if (!brushing || !overCell || placing || disableInteractions) {
            return
        }
        if (brushingWalls) {
            if (!coordinateInArray(walls, overCell)) {
                setWalls([...walls, overCell])
            }
        } else {
            if (coordinateInArray(walls, overCell)) {
                setWalls(walls.filter(wall => !coordinatesEqual(wall, overCell)))
            }
        }
    }, [brushing, brushingWalls, setWalls, walls, overCell, placing, disableInteractions])

    const handleMouseOverCell = useCallback((cellPosition: Coordinate) => {
        setOverCell(cellPosition)
    }, [])

    const handleMouseDownCell = useCallback((cellPosition: Coordinate) => {
        if (disableInteractions) {
            return
        }
        if (coordinatesEqual(cellPosition, start)) {
            setPlacing('start')
        } else if (coordinatesEqual(cellPosition, end)) {
            setPlacing('end')
        } else {
            setBrushing(true)
            if (!coordinateInArray(walls, cellPosition)) {
                setBrushingWalls(true)
            } else {
                setBrushingWalls(false)
            }
        }
    }, [walls, start, end, disableInteractions])

    const handleMouseUpCell = useCallback((cellPosition: Coordinate) => {
        setBrushing(false)
        if (placing) {
            setPlacing(null)
            if (placing === 'start') {
                setStart(cellPosition)
            } else if (placing === 'end') {
                setEnd(cellPosition)
            }
        }
    }, [placing, setStart, setEnd])

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
            } else if (path && coordinateInArray(path, currCoordiante)) {
                type = 'path'
            } else if (searched && coordinateInArray(searched, currCoordiante)) {
                type = 'searched'
            }

            let children: React.ReactNode
            if (toBeSearched && coordinateInArray(toBeSearched, currCoordiante)) {
                children = <div className='grid place-content-center h-full bg-green-500/10' />
            }

            let placingClasses = ''
            if (overCell && coordinatesEqual(currCoordiante, overCell)) {
                if (placing === 'start') {
                    placingClasses = 'bg-blue-300'
                } else if (placing === 'end') {
                    placingClasses = 'bg-red-300'
                }
            }

            cells.push(<GridCell
                className={placingClasses}
                label={alphaRepresentationList[j] + i}
                onMouseDown={() => handleMouseDownCell(currCoordiante)}
                onMouseOver={() => handleMouseOverCell(currCoordiante)}
                onMouseUp={() => handleMouseUpCell(currCoordiante)}
                x={j}
                y={i}
                type={type}
                key={`${j} ${i}`}>
                {children}
            </GridCell>)
        }
    }

    return (<div
        className={`grid border ${className}`}
        onMouseLeave={() => setBrushing(false)}
        onMouseUp={() => setBrushing(false)}
        style={{gridTemplateColumns: `repeat(${width}, 1fr)`, gridTemplateRows: `repeat(${height}, 1fr)`}}>
        {cells}
    </div>)
}
