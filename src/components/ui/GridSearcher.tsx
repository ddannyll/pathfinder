import { Coordinate, Grid } from './Grid';
import { Button } from './Button';
import { useGridBFS } from '../hooks/useGridBFS';
import { coordinateInArray, coordinatesEqual } from '../../helpers';
import { useState } from 'react';

export function GridSearcher () {
    const [walls, setWalls] = useState<Coordinate[]>([])
    const [placingWalls, setPlacingWalls] = useState(true)

    const handleBrush = (position: Coordinate) => {
        if (placingWalls) {
            if (!coordinateInArray(walls, position)) {
                setWalls([...walls, position])
            }
        } else {
            setWalls(walls.filter(curr => !coordinatesEqual(curr, position)))
        }
    }

    const {
        searched,
        currSearching,
        isSearching,
        width,
        height,
        start,
        path,
        end,
        startSearch,
    } = useGridBFS(10, 10, {x:0, y:0}, {x:9, y:9}, walls, 50)

    return (
        <div
            className='flex flex-col items-start gap-2 p-4'
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
            </div>
            <Grid
                onMouseActiveOverCell={handleBrush}
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
    )
}
