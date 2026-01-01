export function createMockECGSource() {
    let listeners = [];
    let t = 0;

    setInterval(() => {
        const ecg =
            Math.sin(2 * Math.PI * 1.2 * t) + // heart rhythm
            0.2 * Math.random();              // noise
        listeners.forEach(fn => fn(ecg));
        t += 1 / 250;
    }, 4);

    return {
        subscribe(fn) {
            listeners.push(fn);
        },
        unsubscribe(fn) {
            listeners = listeners.filter(l => l !== fn);
        },
    };
}
