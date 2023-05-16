import { FSResult } from '../hooks/useGridBFSDFS'
import { Disclosure, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useMemo, useState } from 'react'
import { getAlphaRepresentationList } from '../../helpers'

const BFS = `function BFS(graph, root):
    Queue queue = new Queue()
    Set visited = new Set()
    queue.push(root)
    visited.add(root)
    while (queue is not empty):
        curr = queue.pop()
        for (neighbor in graph.neighbors(curr)):
            if (neighbor not in visited):
                visited.add(neighbor)
                queue.push(neighbor)
`

const DFS = `function DFS(graph, root):
    Stack stack = new Stack()
    Set visited = new Set()
    stack.push(root)
    visited.add(root)
    while (stack is not empty):
        curr = stack.pop()
        for (neighbor in graph.neighbors(curr)):
            if (neighbor not in visited):
                visited.add(neighbor)
                stack.push(neighbor)
`


interface PseudoCodeProps {
    algorithm: 'BFS' | 'DFS'
    currStep: number
    searchResult?: FSResult
    alphaRepresentationList: string[]
}

export default function Pseudocode({algorithm, searchResult, currStep, alphaRepresentationList}: PseudoCodeProps) {
    const visited = searchResult?.visited
        .slice(0, searchResult?.steps[currStep].visitedIndex)
        .map(coordiante => `${alphaRepresentationList[coordiante.x]}${coordiante.y}`)
        .join(', ')


    const deque = searchResult?.steps[currStep].deque
        .map(coordiante => `${alphaRepresentationList[coordiante.x]}${coordiante.y}`)
        .join(', ')


    const neighbors = searchResult?.steps[currStep].neighbors
        .map(coordiante => `${alphaRepresentationList[coordiante.x]}${coordiante.y}`)
        .join(', ')

    const suitableNeighbors = searchResult?.steps[currStep].suitableNeighbors
        .map(coordiante => `${alphaRepresentationList[coordiante.x]}${coordiante.y}`)
        .join(', ')

    return <div className='absolute bottom-0 right-2 w-[550px] overflow-hidden font-mono'>
        <Disclosure>
            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="translate-y-10 backdrop-blur-[0px]"
                enterTo="translate-y-0 backdrop-blur-sm"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Disclosure.Panel className='bg-zinc-800/50 text-zinc-50 p-6 w-full'>
                    <pre className='border-b pb-4 mb-4'>
                        {algorithm === 'BFS' ? BFS : DFS}
                    </pre>
                    <div className="h-[150px] grid grid-cols-2 grid-rows-[10px_1fr] gap-2 font-mono border-b pb-4 mb-4">
                        <h5 className='flex items-center gap-2'>
                            Visited Set:
                            <span className='w-[1rem] aspect-square border border-white bg-zinc-400 inline-block rounded -translate-y-[2px]' />
                            +
                            <span className='w-[1rem] aspect-square border border-white bg-green-200 inline-block rounded -translate-y-[2px]' />
                        </h5>
                        <h5 className='flex items-center gap-2'>
                            {algorithm === 'BFS' ? 'Queue: ' : 'Stack: '}
                            <span className='w-[1rem] aspect-square border border-white bg-green-200 inline-block rounded -translate-y-[2px]' />
                            <span />
                        </h5>
                        <div className="overflow-auto scrollbar-thin scrollbar-thumb-zinc-50">
                            {visited}
                        </div>
                        <div className='overflow-auto scrollbar-thin scrollbar-thumb-zinc-50'>
                            {deque}
                        </div>
                    </div>
                    <div className='grid grid-cols-2'>
                        <h5>
                            Neighbors:
                            <div className='overflow-auto scrollbar-thin scrollbar-thumb-zinc-50'>
                                {neighbors}
                            </div>
                        </h5>
                        <h5>
                            Suitable Neighbors:
                            <div className='overflow-auto scrollbar-thin scrollbar-thumb-zinc-50'>
                                {suitableNeighbors}
                            </div>
                        </h5>
                    </div>
                </Disclosure.Panel>
            </Transition>
            <Disclosure.Button className="text-center w-full bg-amber-300 p-1 z-10">
                <FontAwesomeIcon icon={faChevronUp}/>
            </Disclosure.Button>
        </Disclosure>
    </div>
}


