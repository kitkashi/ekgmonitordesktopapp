import React, { useEffect, useRef } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";
import { createRingBuffer } from "./ecgBuffer";

const SAMPLE_RATE = 250;      // Hz
const WINDOW_SECONDS = 5;     // seconds
const BUFFER_SIZE = SAMPLE_RATE * WINDOW_SECONDS;

export default function ECGPlot({ ecgSampleSource }) {
    const plotRef = useRef(null);
    const uplotRef = useRef(null);
    const bufferRef = useRef(createRingBuffer(BUFFER_SIZE));

    // Precompute time axis
    const timeAxis = new Float32Array(BUFFER_SIZE);
    for (let i = 0; i < BUFFER_SIZE; i++) {
        timeAxis[i] = i / SAMPLE_RATE;
    }

    // Initialize uPlot
    useEffect(() => {
        const opts = {
            width: 900,
            height: 300,
            cursor: { show: false },
            scales: {
                x: { time: false },
                y: { auto: true },
            },
            axes: [
                {
                    label: "Time (s)",
                    values: (u, ticks) =>
                        ticks.map(v => (v - WINDOW_SECONDS).toFixed(1)),
                },
                {
                    label: "mV",
                },
            ],
            series: [
                {},
                {
                    label: "ECG",
                    stroke: "red",
                    width: 1.5,
                },
            ],
        };

        const data = [
            timeAxis,
            new Float32Array(BUFFER_SIZE),
        ];

        uplotRef.current = new uPlot(opts, data, plotRef.current);

        return () => {
            uplotRef.current.destroy();
        };
    }, []);

    // Handle incoming ECG samples (from serial)
    useEffect(() => {
        if (!ecgSampleSource) return;

        const onSample = (sample) => {
            bufferRef.current.push(sample);
        };

        ecgSampleSource.subscribe(onSample);
        return () => ecgSampleSource.unsubscribe(onSample);
    }, [ecgSampleSource]);

    // Update plot at ~60 FPS
    useEffect(() => {
        const interval = setInterval(() => {
            const ecgData = bufferRef.current.getData();
            uplotRef.current.setData([
                timeAxis,
                ecgData,
            ]);
        }, 16); // ~60 FPS

        return () => clearInterval(interval);
    }, []);

    return <div ref={plotRef} />;
}
