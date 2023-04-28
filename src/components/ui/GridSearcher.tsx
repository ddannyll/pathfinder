import { Grid } from './Grid';
import { Button } from './Button';
import { FSResult, FSStep, useGridBFSDFS } from '../hooks/useGridBFSDFS';
import { useEffect, useRef, useState } from 'react';

export function GridSearcher () {
    const [searchMode, setSearchMode] = useState<'BFS'|'DFS'>('BFS')
    const [lockAspect, setLockAspect] = useState(true)
    const gridSpaceRef = useRef<HTMLDivElement>(null)
    const [delay, setDelay] = useState(20)
    const [searchResult, setSearchResult] = useState<FSResult>()
    const [currStep, setCurrStep] = useState(0)
    const [currPathStep, setCurrPathStep] = useState(0)
    const [autoProgress, setAutoProgress] = useState(false)

    const {
        start,
        end,
        width,
        height,
        walls,
        getSearchResult,
        setStart,
        setEnd,
        setHeight,
        setWidth,
        setWalls,
    } = useGridBFSDFS(searchMode, 25, 12, {x:0, y:0}, {x:9, y:9}, [])

    useEffect(() => {
        if (gridSpaceRef.current === null || !lockAspect) {
            return
        }
        const requiredRatio = gridSpaceRef.current.offsetWidth / gridSpaceRef.current.offsetHeight
        const newHeight = Math.floor(1 / (requiredRatio / width))
        setHeight(newHeight)
    }, [gridSpaceRef, lockAspect, width, setHeight])

    useEffect(() => {
        if (!autoProgress || !searchResult) {
            return
        }
        if (currStep < searchResult.steps.length - 1) {
            setTimeout(() => {setCurrStep(currStep + 1)}, delay)
        } else if (currPathStep < searchResult.path.length - 1) {
            setTimeout(() => {setCurrPathStep(currPathStep + 1)}, delay)
        } else {
            setAutoProgress(false)
        }
    }, [currStep, currPathStep, searchResult, delay, autoProgress])

    const startAutoSearch = () => {
        setAutoProgress(true)
        setCurrStep(0)
        setCurrPathStep(0)
        setSearchResult(getSearchResult())
    }

    return (
        <div
            className='flex flex-col gap-2 p-4 h-screen'
        >
            <div className="flex gap-2">
                <Button
                    onClick={autoProgress ? () => setAutoProgress(false) : startAutoSearch }
                >
                    {autoProgress ? 'Stop Search' : 'Start Search'}
                </Button>
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
                    currSearching={searchResult?.steps[currStep].curr}
                    searched={searchResult?.visited.slice(0, searchResult?.steps[currStep].visitedIndex)}
                    path={searchResult?.path.slice(0, currPathStep)}
                    setStart={setStart}
                    setEnd={setEnd}
                    setWalls={setWalls}
                />
            </div>
            <div className="flex gap-2">
                <Button
                    // onClick={() => clearSearched()}
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
