import { Grid } from './Grid';
import { Button } from './Button';
import { useGridBFSDFS } from '../hooks/useGridBFSDFS';
import { useEffect, useRef, useState } from 'react';

export function GridSearcher () {
    const [searchMode, setSearchMode] = useState<'BFS'|'DFS'>('BFS')
    const [lockAspect, setLockAspect] = useState(true)
    const gridSpaceRef = useRef<HTMLDivElement>(null)
    const [delay, setDelay] = useState(20)

    const {
        searched,
        currSearching,
        isSearching,
        start,
        path,
        end,
        width,
        height,
        walls,
        startSearch,
        setStart,
        setEnd,
        setHeight,
        setWidth,
        setWalls,
        clearSearched,
    } = useGridBFSDFS(searchMode, 25, 12, {x:0, y:0}, {x:9, y:9}, [], delay)

    useEffect(() => {
        if (gridSpaceRef.current === null || !lockAspect) {
            return
        }
        const requiredRatio = gridSpaceRef.current.offsetWidth / gridSpaceRef.current.offsetHeight
        const newHeight = Math.floor(1 / (requiredRatio / width))
        setHeight(newHeight)
    }, [gridSpaceRef, lockAspect, width, setHeight])

    return (
        <div
            className='flex flex-col gap-2 p-4 h-screen'
        >
            <div className="flex gap-2">
                <Button disabled={isSearching} onClick={() => startSearch()}>Search</Button>
                <Button
                    onClick={() => setSearchMode(searchMode === 'BFS' ? 'DFS' : 'BFS')}
                >
                    {searchMode}
                </Button>
                <label className='flex flex-col justify-center items-center'>
                    {`Width: ${width}`}
                    <input
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        type="range" min={5} max={50} step={1}/>
                </label>
                <label className='flex flex-col justify-center items-center'>
                    {`Height: ${height}`}
                    <input
                        disabled={lockAspect}
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        type="range" min={5} max={50} step={1}/>
                </label>
                <label htmlFor="lockAspect" className='flex flex-col items-center'>
                    Lock Aspect
                    <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.currentTarget.checked)}/>
                </label>
                <label htmlFor="range" className='flex flex-col justify-center items-center'>
                    {`Delay: ${delay}`}
                    <input
                        value={delay}
                        onChange={(e) => setDelay(parseInt(e.target.value))}
                        type="range" min={5} max={250} step={1}/>
                </label>
            </div>
            <div ref={gridSpaceRef} className="grow max-h-full overflow-auto">
                <Grid
                    width={width}
                    height={height}
                    start={start}
                    end={end}
                    walls={walls}
                    currSearching={currSearching}
                    searched={searched}
                    path={path}
                    setStart={setStart}
                    setEnd={setEnd}
                    setWalls={setWalls}
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
