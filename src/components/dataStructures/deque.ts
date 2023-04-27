/**
 * Generic Deque (double ended queue) implementation
 */
export class Deque<T> {
    private length: number
    private head: null | DequeNode<T>
    private tail: null | DequeNode<T>

    constructor() {
        this.head = null
        this.tail = null
        this.length = 0
    }

    private pushEmpty(val: T) {
        if (!this.isEmpty()) {
            throw new Error('Attempted to call pushEmpty on a non-empty deque')
        }
        const node = new DequeNode(val, null, null)
        this.head = node
        this.tail = node
        this.length += 1
    }

    private popSingle() {
        if (this.length !== 1) {
            throw new Error('Deque must have only one value to use popSingle')
        }
        const val = (this.head as DequeNode<T>).val
        this.head = null
        this.tail = null
        this.length--
        return val
    }

    isEmpty() {
        return this.length === 0
    }

    pushLeft(val: T) {
        if (this.isEmpty()) {
            this.pushEmpty(val)
        } else {
            const node = new DequeNode(val, this.head, null);
            (this.head as DequeNode<T>).prev = node
            this.head = node
            this.length++
        }
    }

    pushRight(val: T) {
        if (this.isEmpty()) {
            this.pushEmpty(val)
        } else {
            const node = new DequeNode(val, null, this.tail);
            (this.tail as DequeNode<T>).next = node
            this.tail = node
            this.length++
        }
    }

    popLeft() {
        if (this.isEmpty()) {
            throw new Error('Cannot pop an empty deque')
        } else if (this.length === 1) {
            return this.popSingle()
        } else {
            this.head = this.head as DequeNode<T>
            const val = this.head.val
            this.head = this.head.next;
            (this.head as DequeNode<T>).prev = null
            this.length--
            return val
        }
    }

    popRight() {
        if (this.isEmpty()) {
            throw new Error('Cannot pop an empty deque')
        } else if (this.length === 1) {
            return this.popSingle()
        } else {
            this.tail = this.tail as DequeNode<T>
            const val = this.tail.val
            this.tail = this.tail.prev;
            (this.tail as DequeNode<T>).next = null
            this.length--
            return val
        }
    }

    getValues() {
        const output: T[] = []
        let curr = this.head
        while (curr !== null) {
            output.push(curr.val)
            curr = curr.next
        }
        return output
    }
}

class DequeNode<T> {
    val: T;
    next: DequeNode<T> | null
    prev: DequeNode<T> | null

    constructor (val: T, next: DequeNode<T> | null, prev: DequeNode<T> | null) {
        this.val = val
        this.next = next
        this.prev = prev
    }
}
