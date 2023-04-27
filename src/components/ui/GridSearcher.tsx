import { Coordinate, Grid } from './Grid';
import { Button } from './Button';
import { useGridBFSDFS } from '../hooks/useGridBFSDFS';
import { coordinateInArray, coordinatesEqual } from '../../helpers';
import { useEffect, useRef, useState } from 'react';

export function GridSearcher () {
    const [placingWalls, setPlacingWalls] = useState(true)
    const [movingElement, setMovingElement] = useState<'start' | 'end' | undefined>()
    const [searchMode, setSearchMode] = useState<'BFS'|'DFS'>('BFS')
    const [lockAspect, setLockAspect] = useState(true)
    const gridSpaceRef = useRef<HTMLDivElement>(null)

    const {
        searched,
        currSearching,
        isSearching,
        start,
        path,
        end,
        width,
        height,
        startSearch,
        setStart,
        setEnd,
        setHeight,
        setWidth,
        setWalls,
        clearSearched,
        walls,
    } = useGridBFSDFS(searchMode, 40, 15, {x:0, y:0}, {x:9, y:9}, [], 10)

    useEffect(() => {
        if (gridSpaceRef.current === null || !lockAspect) {
            return
        }
        const requiredRatio = gridSpaceRef.current.offsetWidth / gridSpaceRef.current.offsetHeight
        const newHeight = Math.floor(1 / (requiredRatio / width))
        setHeight(newHeight)
    }, [gridSpaceRef, lockAspect, width])


    const handleBrush = (position: Coordinate) => {
        if (movingElement || isSearching) {
            return
        }
        if (placingWalls) {
            if (!coordinateInArray(walls, position) && !coordinatesEqual(end, position)) {
                setWalls([...walls, position])
            }
        } else {
            setWalls(walls.filter(curr => !coordinatesEqual(curr, position)))
        }
    }

    const handleCellClick = (position: Coordinate) => {
        if (isSearching) {
            return
        }
        if (movingElement === 'start') {
            setStart(position)
            setMovingElement(undefined)
            setWalls(walls.filter(wall => !coordinatesEqual(wall, position)))
        } else if (movingElement === 'end') {
            setEnd(position)
            setMovingElement(undefined)
            setWalls(walls.filter(wall => !coordinatesEqual(wall, position)))
        } else if (coordinatesEqual(end, position)) {
            setMovingElement('end')
        } else if (coordinatesEqual(start, position)) {
            setMovingElement('start')

        }
    }

    return (
        <div
            className='flex flex-col gap-2 p-4 h-screen'
            onKeyDown={(e) => {
                if (e.key ===  'x') {
                    setPlacingWalls(!placingWalls)
                }
            }}
        >
            <div className="flex gap-2">
                <Button disabled={isSearching} onClick={() => startSearch()}>Search</Button>
                <Button
                    type={placingWalls ? 'primary' : 'secondary'}
                    onClick={() => setPlacingWalls(!placingWalls)}
                >
                    {`${placingWalls ? 'Placing Walls' : 'Erasing'}`}
                </Button>
                <Button
                    onClick={() => setSearchMode(searchMode === 'BFS' ? 'DFS' : 'BFS')}
                >
                    {searchMode}
                </Button>
                <label htmlFor="range" className='flex flex-col justify-center items-center'>
                    {`Width: ${width}`}
                    <input
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        type="range" id="range" min={5} max={50} step={1}/>
                </label>
                <label htmlFor="range" className='flex flex-col justify-center items-center'>
                    {`Height: ${height}`}
                    <input
                        disabled={lockAspect}
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        type="range" id="range" min={5} max={50} step={1}/>
                </label>
                <label htmlFor="lockAspect" className='flex flex-col items-center'>
                    Lock Aspect
                    <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.currentTarget.checked)}/>
                </label>
            </div>
            <div ref={gridSpaceRef} className="grow max-h-full overflow-auto">
                <Grid
                    onCellClick={handleCellClick}
                    onMouseActiveOverCell={handleBrush}
                    movingElement={movingElement}
                    width={width}
                    height={height}
                    start={start}
                    end={end}
                    walls={walls}
                    currSearching={currSearching}
                    searched={searched}
                    path={path}
                />
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={() => clearSearched()}
                >
                    Clear Path
                </Button>
                <Button
                    onClick={() => setWalls([])}
                >
                    Clear Walls
                </Button>
            </div>
        </div>
    )
}
