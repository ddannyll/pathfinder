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

export function getAlphaRepresentationList(maxN: number) {
    if (maxN < 1) {
        return []
    }
    const res = [['A']]
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    while(res.length < maxN) {
        const curr = [...res[res.length - 1]]
        let i = curr.length - 1
        while (i >= 0 && curr[i] == 'Z') {
            curr[i] = 'A'
            i -= 1
        }
        if (i >= 0) {
            curr[i] = alphabet[alphabet.indexOf(curr[i]) + 1]
        } else {
            curr.unshift('A')
        }
        res.push(curr)
    }
    return res.map(charList => charList.join(''))
}
