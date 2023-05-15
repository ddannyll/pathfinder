import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from './Button'
import { SearchStates } from './GridSearcher'
import { FSResult } from '../hooks/useGridBFSDFS'

interface ControlsProps {
    setAutoProgress: React.Dispatch<React.SetStateAction<boolean>>
    setCurrPathStep: React.Dispatch<React.SetStateAction<number>>
    setCurrStep: React.Dispatch<React.SetStateAction<number>>
    startAutoSearch: () => void
    searchState: SearchStates
    autoProgress: boolean
    currStep: number
    searchResult?: FSResult
    autoTimeout?: ReturnType<typeof setTimeout>
}

export default function Controls ({setAutoProgress, setCurrPathStep, setCurrStep, searchState, autoProgress, searchResult, currStep, startAutoSearch, autoTimeout}: ControlsProps) {
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

    return <>
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
    </>
}
