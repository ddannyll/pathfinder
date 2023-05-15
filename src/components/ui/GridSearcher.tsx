import { Coordinate, Grid } from './Grid';
import { Button } from './Button';
import { FSResult, useGridBFSDFS } from '../hooks/useGridBFSDFS';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons';

export function GridSearcher() {
    const [searchMode, setSearchMode] = useState<'BFS' | 'DFS'>('BFS')
    const [lockAspect, setLockAspect] = useState(true)
    const gridSpaceRef = useRef<HTMLDivElement>(null)
    const [delay, setDelay] = useState(20)
    const [searchResult, setSearchResult] = useState<FSResult>()
    const [currStep, setCurrStep] = useState(0)
    const [currPathStep, setCurrPathStep] = useState(0)
    const [autoProgress, setAutoProgress] = useState(false)
    const [autoTimeout, setAutoTimeout] = useState<ReturnType<typeof setTimeout>>()

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
    } = useGridBFSDFS(searchMode, 25, 12, { x: 0, y: 0 }, { x: 100, y: 100 }, [])


    const searchState = useMemo<'idle' | 'search' | 'backtrack' | 'done'>(() => {
        if (currStep === 0 || !searchResult) {
            return 'idle'
        } else if (currStep < searchResult.steps.length - 1) {
            return 'search'
        } else if (currPathStep < searchResult.path.length - 1) {
            setAutoProgress(true)
            return 'backtrack'
        } else {
            return 'done'
        }
    }, [currStep, searchResult, currPathStep])

    useEffect(() => {
        // Aspect Ratio Lock
        if (gridSpaceRef.current === null || !lockAspect) {
            return
        }
        const requiredRatio = gridSpaceRef.current.offsetWidth / gridSpaceRef.current.offsetHeight
        const newHeight = Math.floor(1 / (requiredRatio / width))
        setHeight(newHeight)
    }, [gridSpaceRef, lockAspect, width, setHeight])

    useEffect(() => {
        // Prevent previous timeout from executing when autoProgress is turned off
        if (!autoProgress) {
            clearTimeout(autoTimeout)
        }
    }, [autoProgress, autoTimeout])


    useEffect(() => {
        // Handling step increments when autoProgress is enabled
        if (!searchResult || !autoProgress) {
            return
        }
        if (searchState === 'idle' || searchState === 'search') {
            setAutoTimeout(setTimeout(() => { setCurrStep(currStep + 1) }, delay))
        } else if (searchState === 'backtrack') {
            setAutoTimeout(setTimeout(() => { setCurrPathStep(currPathStep + 1) }, delay))
        } else {
            setAutoProgress(false)
        }
    }, [currStep, currPathStep, searchResult, delay, autoProgress, searchState])

    useEffect(() => {
        // Remove path if alogorithm is not in the backtrack/done search state
        if (searchState === 'search' || searchState === 'idle') {
            setCurrPathStep(0)
        }
    }, [autoProgress, searchState])

    const startAutoSearch = () => {
        setAutoProgress(true)
        setCurrStep(0)
        setCurrPathStep(0)
        setSearchResult(getSearchResult())
    }

    let mainButtonText = ''
    if (autoProgress) {
        mainButtonText = 'Pause'
    } else if (searchState === 'idle') {
        mainButtonText = 'Search'
    } else if (searchState === 'done') {
        mainButtonText = 'Restart'
    } else {
        mainButtonText = 'Resume'
    }

    return (
        <div
            className='flex flex-col gap-2 p-4 h-screen'
        >
            <div className="flex gap-2">
                <Button
                    onClick={() => setWalls([])}
                >
                    Clear Walls
                </Button>
                <Button
                    onClick={() => setSearchMode(searchMode === 'BFS' ? 'DFS' : 'BFS')}
                >
                    {searchMode}
                </Button>
                <label htmlFor="range" className='flex flex-col justify-center items-center'>
                    {`Delay: ${delay}`}
                    <input
                        disabled={autoProgress}
                        onChange={(e) => {
                            setDelay(parseInt(e.target.value))
                        }}
                        type="range" min={5} max={1000} step={1} />
                </label>
                <label className='flex flex-col justify-center items-center'>
                    {`Width: ${width}`}
                    <input
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        type="range" min={5} max={50} step={1} />
                </label>
                <label className='flex flex-col justify-center items-center'>
                    {`Height: ${height}`}
                    <input
                        disabled={lockAspect}
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        type="range" min={5} max={50} step={1} />
                </label>
                <label htmlFor="lockAspect" className='flex flex-col items-center'>
                    Lock Aspect
                    <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.currentTarget.checked)} />
                </label>
            </div>
            <div ref={gridSpaceRef} className="grow max-h-full overflow-auto">
                <Grid
                    disableInteractions={searchState === 'search' || searchState === 'backtrack'}
                    width={width}
                    height={height}
                    start={start}
                    end={end}
                    walls={walls}
                    currSearching={searchResult?.steps[currStep].curr || undefined}
                    searched={searchResult?.steps.map(step => step.curr).slice(1, currStep) as Coordinate[]}
                    toBeSearched={searchResult?.steps[currStep].deque}
                    path={searchResult?.path.slice(0, currPathStep)}
                    setStart={setStart}
                    setEnd={setEnd}
                    setWalls={setWalls}
                />
            </div>
            <div className="flex flex-col items-center gap-2 grid-cols-3 md:grid md:items-stretch">
                <Button
                    className='md:place-self-start'
                    onClick={() => {
                        clearTimeout(autoTimeout)
                        setAutoProgress(false)
                        setCurrPathStep(0)
                        setCurrStep(0)
                    }}
                >
                    Reset Timeline
                </Button>
                <div className="flex gap-2 justify-center">
                    <Button
                        onClick={() => {
                            setAutoProgress(false)
                            setCurrStep(prev => Math.max(0, prev -1))
                        }}
                    >
                        <FontAwesomeIcon icon={faBackward} className='h-full'/>
                    </Button>
                    <Button
                        className='w-28'
                        onClick={
                            () => {
                                if (autoProgress) {
                                    setAutoProgress(false)
                                } else if (searchState === 'idle' || searchState === 'done') {
                                    startAutoSearch()
                                } else {
                                    setAutoProgress(true)
                                }
                            }
                        }
                    >
                        {mainButtonText}
                    </Button>
                    <Button
                        onClick={() => {
                            if (!searchResult) {
                                return
                            }
                            setAutoProgress(false)
                            setCurrStep(prev => Math.min(searchResult.steps.length - 1, prev + 1))
                        }}
                    >
                        <FontAwesomeIcon icon={faForward} className='h-full'/>
                    </Button>
                </div>
            </div>
            <input id="progressSlider" type="range" max={searchResult ? searchResult.steps.length - 1 : 0} min={0} value={currStep}
                onChange={(e) => {
                    setCurrStep(parseInt(e.target.value))
                    setAutoProgress(false)
                }}
            />
            <label htmlFor="progressSlider" className='text-center'>
                {searchResult ? `Step ${currStep} / ${searchResult.steps.length - 1}` : 'Click the search button to start searching!'}
            </label>
        </div>
    )
}
