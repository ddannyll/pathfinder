import { useCallback, useState } from 'react'
import { coordinateInArray, coordinatesEqual } from '../../helpers'
import { Coordinate } from '../ui/Grid'


export function useGridBFSDFS (mode: 'BFS' | 'DFS', width: number, height: number, start: Coordinate, end:Coordinate, walls: Coordinate[], delay: number) {
    const [currSearching, setCurrSearching] = useState<Coordinate|undefined>(undefined)
    const [searched, setSearched] = useState<Coordinate[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [path, setPath] = useState<Coordinate[]>([])

    const startSearch = useCallback(async () => {
        setIsSearching(true)
        setPath([])

        interface positionAndPrevious {
            curr: Coordinate,
            prev: null | Coordinate
        }

        const queue: positionAndPrevious[] = [{curr: start, prev: null}]
        const visited: Coordinate[] = []
        const pathMatrix: Coordinate[][] = Array.from(Array(height), () => new Array(width)) // 2D array

        while (queue.length > 0) {
            const {curr, prev} = mode === 'BFS' ? queue.shift() as positionAndPrevious: queue.pop() as positionAndPrevious
            if (coordinateInArray(visited, curr)) {
                continue
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            visited.push(curr)
            setSearched(visited)
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
            neighbors = neighbors.filter(pos => !coordinateInArray(walls, pos))
            for (const neighbor of neighbors) {
                queue.push({curr: neighbor, prev:curr})
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
    }, [start, end, width, height])

    return { width, height, walls, start, end, searched, path, currSearching, startSearch, isSearching }
}
