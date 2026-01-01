export function createRingBuffer(size) {
    const buffer = new Float32Array(size);
    let index = 0;

    return {
        push(value) {
            buffer[index] = value;
            index = (index + 1) % size;
        },
        getData() {
            // Return buffer in correct time order
            return [
                ...buffer.slice(index),
                ...buffer.slice(0, index),
            ];
        },
    };
}
