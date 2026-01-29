import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value, duration = 1000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const startValue = 0;
        const endValue = parseInt(value) || 0;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Power-out easing for a smoother "boot" sequence
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(easeOut * endValue));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [value, duration]);

    return (
        <span>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
};

export default AnimatedCounter;
