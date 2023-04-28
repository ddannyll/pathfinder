import { useCallback, useEffect, useMemo, useState } from 'react'
import { coordinateInArray, coordinatesEqual } from '../../helpers'
import { Coordinate } from '../ui/Grid'
import { Deque } from '../dataStructures/deque'

export interface FSResult {
    mode: 'BFS' | 'DFS'
    found: boolean
    visited: Coordinate[]
    steps: FSStep[]
    path: Coordinate[]
}


export interface FSStep {
    curr: Coordinate
    prev: Coordinate | null
    currStatus: 'visited' | 'new' | 'target'
    visitedIndex: number
    neighbors: Coordinate[]
    suitableNeighbors: Coordinate[]
    deque: Coordinate[]
}

export interface FSPathStep {
    pathIndex: number
}



export function useGridBFSDFS (
    mode: 'BFS' | 'DFS',
    initialWidth: number,
    initialHeight: number,
    initialStart: Coordinate,
    initialEnd:Coordinate,
    initialWalls: Coordinate[],
) {

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
        // On resize, ensure that start and end points are in the grid
        if (start.x >= width || start.y >= height) {
            setStart({x: 0, y: 0})
            setWalls(walls.filter(wall => !coordinatesEqual({x: 0, y:0}, wall)))
        }
        if (end.x >= width || end.y >= height) {
            setEnd({x: width - 1, y: height - 1})
            setWalls(walls.filter(wall => !coordinatesEqual({x: width - 1, y: height - 1}, wall)))
        }
    }, [width, height, start, end, walls])

    useEffect(() => {
        // effect to prevent overlapping walls with start / end cells
        if (coordinateInArray(walls, start)) {
            setWalls(walls.filter(wall => !coordinatesEqual(start, wall)))
        }
        if (coordinateInArray(walls, end)) {
            setWalls(walls.filter(wall => !coordinatesEqual(end, wall)))
        }
    }, [walls, start, end, setStart])


    const getSearchResult = useCallback(() => {
        const searchResult: FSResult = {
            found: false,
            mode,
            visited: [],
            steps: [],
            path: [],
        }

        interface PositionAndPrevious {
            curr: Coordinate,
            prev: null | Coordinate
        }
        const deque = new Deque<PositionAndPrevious>()
        deque.pushLeft({curr: start, prev:null})
        const visitedArray: Coordinate[] = []
        const visitedMatrix: boolean[][] = Array.from(Array(height), () => new Array(width))// 2D array
        const pathMatrix: Coordinate[][] = Array.from(Array(height), () => new Array(width))

        while (!deque.isEmpty()) {
            const {curr, prev} = mode === 'BFS' ? deque.popLeft() as PositionAndPrevious: deque.popRight() as PositionAndPrevious
            const currStep: FSStep = {
                curr,
                prev,
                neighbors: [],
                suitableNeighbors:[],
                currStatus: 'new',
                visitedIndex: visitedArray.length,
                deque: [...(deque.getValues()).map(posPrev => posPrev.curr)],
            }
            searchResult.steps.push(currStep)
            if (visitedMatrix[curr.y][curr.x]) {
                currStep.currStatus = 'visited'
                continue
            }
            visitedMatrix[curr.y][curr.x] = true
            visitedArray.push(curr)
            if (prev !== null) {
                pathMatrix[curr.y][curr.x] = prev
            }
            if (coordinatesEqual(curr, end)) {
                currStep.currStatus = 'target'
                searchResult.found = true
                break
            }
            let neighbors = [
                { ...curr,   x: curr.x + 1 },
                { ...curr,   y: curr.y - 1 },
                { ...curr,   x: curr.x - 1 },
                { ...curr,   y: curr.y + 1 },
            ]
            neighbors = neighbors.filter(pos => pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height)
            currStep.neighbors = [...neighbors]
            neighbors = neighbors.filter(pos => !wallMatrix[pos.y][pos.x] && !visitedMatrix[pos.y][pos.x])
            currStep.suitableNeighbors = [...neighbors]
            for (const neighbor of neighbors) {
                deque.pushRight({curr: neighbor, prev:curr})
            }
        }
        searchResult.visited = visitedArray

        // backtrack
        let curr = pathMatrix[end.y][end.x]
        searchResult.path.push(curr)
        while (curr && !coordinatesEqual(curr, start)) {
            curr = pathMatrix[curr.y][curr.x]
            searchResult.path.push(curr)
        }
        return searchResult
    }, [start, end, width, height, wallMatrix, mode])


    return {
        width,
        height,
        walls,
        start,
        end,
        getSearchResult,
        setWidth,
        setHeight,
        setWalls,
        setEnd,
        setStart,
    }
}
