import { useCallback, useState } from 'react'
import { coordinateInArray, coordinatesEqual } from '../../helpers'
import { Coordinate } from '../ui/Grid'


export function useGridBFS (width: number, height: number, start: Coordinate, end:Coordinate, walls: Coordinate[], delay: number) {
    const [currSearching, setCurrSearching] = useState<Coordinate|undefined>(undefined)
    const [searched, setSearched] = useState<Coordinate[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [path, setPath] = useState<Coordinate[]>([])

    const startSearch = useCallback(async () => {
        setIsSearching(true)
        setPath([])
        const queue = [start]
        const toBeVisited: Coordinate[] = [start]
        const visited: Coordinate[] = []
        const pathMatrix: Coordinate[][] = Array.from(Array(height), () => new Array(width)) // 2D array

        while (queue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            const curr = queue.shift() as Coordinate
            visited.push(curr)
            setSearched(visited)
            setCurrSearching(curr)
            if (coordinatesEqual(curr, end)) {
                break
            }
            let neighbors = [
                { ...curr,   x: curr.x + 1 },
                { ...curr,   x: curr.x - 1 },
                { ...curr,   y: curr.y + 1 },
                { ...curr,   y: curr.y - 1 },
            ]
            neighbors = neighbors.filter(pos => pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height)
            neighbors = neighbors.filter(pos => !coordinateInArray(walls, pos) && !coordinateInArray(toBeVisited, pos))
            for (const neighbor of neighbors) {
                pathMatrix[neighbor.y][neighbor.x] = curr
                queue.push(neighbor)
                toBeVisited.push(neighbor)
            }
        }

        // backtrack
        let curr = pathMatrix[end.y][end.x]
        const tempPath = [curr]
        while (curr && !coordinatesEqual(curr, start)) {
            await new Promise(resolve => setTimeout(resolve, delay));
            setPath([...tempPath])
            curr = pathMatrix[curr.y][curr.x]
            tempPath.push(curr)
        }

        setIsSearching(false)
    }, [start, end, width, height])

    return { width, height, walls, start, end, searched, path, currSearching, startSearch, isSearching }
}
