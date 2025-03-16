import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function TrainingProgress() {
    const [progress, setProgress] = useState(0);
    const [trainingComplete, setTrainingComplete] = useState(false);
    const t = useTranslations("Training");
    useEffect(() => {
        if (progress < 100) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const nextValue = prev + Math.floor(Math.random() * 10) + 5;
                    if (nextValue >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setTrainingComplete(true), 800);
                        return 100; // Prevents exceeding 100%
                    }
                    return nextValue;
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [progress]);

    return (
        <div className="flex justify-center items-center ">
            {!trainingComplete ? <CircularProgress progress={progress} t={t} /> : <SuccessAnimation  t={t} />}
        </div>
    );
}

function CircularProgress({ progress, t }) {
    const circleRadius = 50;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const progressOffset = circleCircumference - (progress / 100) * circleCircumference;

    return (
        <div className="relative flex flex-col items-center">
            <svg className="w-80 h-80" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    stroke="black"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={circleCircumference}
                />
                <motion.circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    stroke="#A3E635"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    animate={{ strokeDashoffset: progressOffset }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </svg>

            <div className="absolute top-1/2 transform -translate-y-1/2 flex flex-col items-center">
                <motion.p
                    className="text-6xl font-bold text-black"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    {progress}%
                </motion.p>
                <p className="text-gray-700 text-lg mt-2">{t("inProgress")}</p>
            </div>
        </div>
    );
}

function SuccessAnimation({ t }) {
    const [showBubbles, setShowBubbles] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setShowBubbles(false);
        }, 2000);
    }, []);

    const bubbles = [...Array(14)].map((_, i) => ({
        id: i,
        size: Math.random() * 90 + 40,
        x: (Math.random() - 0.5) * 500, // Moves in all directions
        y: (Math.random() - 0.5) * 500, // Moves in all directions
        opacity: Math.random() * 0.6 + 0.4,
        color: `hsl(${Math.random() * 360}, 80%, 80%)`,
    }));

    return (
        <div className="flex flex-col items-center justify-center relative pt-28">
            {showBubbles &&
                bubbles.map((bubble) => (
                    <motion.div
                        key={bubble.id}
                        className="absolute rounded-full"
                        style={{
                            width: bubble.size,
                            height: bubble.size,
                            backgroundColor: bubble.color,
                            top: "50%",
                            left: "50%",
                            opacity: bubble.opacity,
                        }}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                        animate={{ x: bubble.x, y: bubble.y, scale: 1.5, opacity: 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                ))}

            <motion.div
                className="bg-lime-400 rounded-full flex items-center justify-center shadow-xl"
                style={{ width: 180, height: 180 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    width="100"
                    height="100"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                >
                    <path d="M20.285 6.705c.391.39.391 1.024 0 1.414l-9 9c-.39.39-1.024.39-1.414 0l-5-5c-.391-.39-.391-1.024 0-1.414s1.024-.39 1.414 0L10 14.086l8.585-8.585c.39-.39 1.024-.39 1.414 0z" />
                </motion.svg>
            </motion.div>

            <motion.p
                className="text-black font-bold text-5xl mt-14"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
            >
                {t("success")}
            </motion.p>
        </div>
    );
}
