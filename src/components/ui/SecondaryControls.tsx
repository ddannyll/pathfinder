import { useEffect, useState } from 'react'
import { Button } from './Button'
import { Coordinate } from './Grid'
import { Listbox } from '@headlessui/react'
import { SearchStates } from './GridSearcher'

interface SecondaryControlsProps  {
    searchState: SearchStates
    searchMode: 'BFS' | 'DFS'
    delay: number
    setDelay: React.Dispatch<React.SetStateAction<number>>
    autoProgress: boolean
    width: number
    height: number
    setWidth: React.Dispatch<React.SetStateAction<number>>
    setHeight: React.Dispatch<React.SetStateAction<number>>
    lockAspect: boolean
    setLockAspect: React.Dispatch<React.SetStateAction<boolean>>
    setWalls: React.Dispatch<React.SetStateAction<Coordinate[]>>
    setSearchMode: React.Dispatch<React.SetStateAction<'BFS' | 'DFS'>>
}

const delayPresets = {
    fast: 5,
    normal: 50,
    slow: 350,
}
export default function SecondaryControls({searchMode, searchState, setDelay, width, setWidth, height, lockAspect, setHeight, setLockAspect, setWalls, setSearchMode}: SecondaryControlsProps) {
    const [selectedDelay, setSelectedDelay] = useState<'normal' | 'fast' | 'slow'>('normal')
    useEffect(() => {
        setDelay(delayPresets[selectedDelay])
    }, [selectedDelay, setDelay])


    return <div className="flex gap-2">
        <Button
            onClick={() => setWalls([])}
            disabled={searchState === 'search'}

        >
        Clear Walls
        </Button>
        <Button
            onClick={() =>
                setSearchMode(searchMode === 'BFS' ? 'DFS' : 'BFS')
            }
            disabled={searchState === 'search'}
        >
            {searchMode}
        </Button>
        <Listbox onChange={setSelectedDelay}>
            <div className="relative">
                <Listbox.Button className="border rounded w-24 px-5 relative py-2">{selectedDelay}</Listbox.Button>
                <Listbox.Options className="absolute border rounded left-0 top-12 z-10 bg-white">
                    {Object.keys(delayPresets).reverse().map(delayName => (
                        <Listbox.Option
                            key={delayName}
                            value={delayName}
                            className="cursor-pointer hover:bg-indigo-50 px-5 py-2 rounded"
                        >
                            {delayName}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>

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
}
