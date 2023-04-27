import { useCallback, useEffect, useMemo, useState } from 'react'
import { coordinateInArray, coordinatesEqual } from '../../helpers'
import { Coordinate } from '../ui/Grid'
import { Deque } from '../dataStructures/deque'


export function useGridBFSDFS (
    mode: 'BFS' | 'DFS',
    initialWidth: number,
    initialHeight: number,
    initialStart: Coordinate,
    initialEnd:Coordinate,
    initialWalls: Coordinate[],
    delay: number) {

    const [currSearching, setCurrSearching] = useState<Coordinate|undefined>(undefined)
    const [searched, setSearched] = useState<Coordinate[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [path, setPath] = useState<Coordinate[]>([])
    const [width, setWidth] = useState(initialWidth)
    const [height, setHeight] = useState(initialHeight)
    const [start, setStart] = useState(initialStart)
    const [end, setEnd] = useState(initialEnd)
    const [walls, setWalls] = useState(initialWalls)

    const wallMatrix = useMemo(() => {
        // Used to optimise algorithm
        const matrix: boolean[][] = Array.from(Array(height), () => new Array(width))
        for (const {x, y} of walls) {
            if (x >= 0 && y >= 0 && x < width && y < height) {
                matrix[y][x] = true
            }
        }
        return matrix
    }, [walls, height, width])

    useEffect(() => {
        if (start.x >= width || start.y >= height) {
            setStart({x: 0, y: 0})
        }
        if (end.x >= width || end.y >= height) {
            setEnd({x: width - 1, y: height - 1})
        }
    }, [width, height])

    const clearSearched = () => {
        setSearched([])
    }

    const startSearch = useCallback(async () => {
        setIsSearching(true)
        setPath([])

        interface positionAndPrevious {
            curr: Coordinate,
            prev: null | Coordinate
        }

        const deque = new Deque<positionAndPrevious>()
        deque.pushLeft({curr: start, prev: null})

        const visitedArray: Coordinate[] = []
        const visitedMatrix: boolean[][] = Array.from(Array(height), () => new Array(width))
        const pathMatrix: Coordinate[][] = Array.from(Array(height), () => new Array(width)) // 2D array

        while (!deque.isEmpty()) {
            const {curr, prev} = mode === 'BFS' ? deque.popLeft() as positionAndPrevious: deque.popRight() as positionAndPrevious
            if (visitedMatrix[curr.y][curr.x]) {
                continue
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            visitedMatrix[curr.y][curr.x] = true
            visitedArray.push(curr)
            setSearched(visitedArray)
            setCurrSearching(curr)
            if (prev !== null) {
                pathMatrix[curr.y][curr.x] = prev
            }
            if (coordinatesEqual(curr, end)) {
                break
            }
            let neighbors = [
                { ...curr,   x: curr.x + 1 },
                { ...curr,   y: curr.y - 1 },
                { ...curr,   x: curr.x - 1 },
                { ...curr,   y: curr.y + 1 },
            ]
            neighbors = neighbors.filter(pos => pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height)
            neighbors = neighbors.filter(pos => !wallMatrix[pos.y][pos.x])
            for (const neighbor of neighbors) {
                deque.pushRight({curr: neighbor, prev:curr})
            }
        }

        // backtrack
        let curr = pathMatrix[end.y][end.x]
        const tempPath = [curr]
        while (curr && !coordinatesEqual(curr, start)) {
            setCurrSearching(undefined)
            await new Promise(resolve => setTimeout(resolve, delay));
            setPath([...tempPath])
            curr = pathMatrix[curr.y][curr.x]
            tempPath.push(curr)
        }

        setIsSearching(false)
    }, [start, end, width, height, wallMatrix, mode])

    return {
        width,
        height,
        walls,
        start,
        end,
        searched,
        path,
        currSearching,
        isSearching,
        startSearch,
        clearSearched,
        setWidth,
        setHeight,
        setWalls,
        setEnd,
        setStart,
    }
}
