import { Coordinate } from './components/ui/Grid';

export function coordinatesEqual(coordianteOne: Coordinate, coordinateTwo: Coordinate) {
    return coordianteOne.x === coordinateTwo.x && coordianteOne.y === coordinateTwo.y
}

export function coordinateInArray(coordinateArray: Coordinate[], coordiante: Coordinate) {
    for (const currCoordiante of coordinateArray) {
        if (coordinatesEqual(currCoordiante, coordiante)) {
            return true
        }
    }
    return false
}

export function coordinateInGrid(coordinate: Coordinate, width:number, height:number) {
    const {x, y} = coordinate
    return x >= 0 && y >= 0 && x < width && y < height
}
