import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type WeightType = "title" | "subtitle";

const FONT_WEIGHTS: Record<WeightType, { min: number; max: number; default: number }> = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 },
};

const renderText = (text: string, className?: string, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));
};

const setUpHover = (
    container: HTMLElement | null,
    type: WeightType
): (() => void) | undefined => {
    if (!container) return;

    const letters = container.querySelectorAll("span") as NodeListOf<HTMLSpanElement>;
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const animateLetter = (letter: HTMLSpanElement, weight: number, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `'wght' ${weight}`,
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach(letter => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2));
            const intensity = Math.exp(-(distance ** 2) / 1000);

            animateLetter(letter, min + (max - min) * intensity);
        });
    };

    const handleMouseLeave = () => {
        letters.forEach(letter => animateLetter(letter, base, 0.3));
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    };
};

const Welcome = () => {
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const subtitleRef = useRef<HTMLParagraphElement | null>(null);

    useGSAP(() => {
        const cleanupTitle = setUpHover(titleRef.current, "title");
        const cleanupSubtitle = setUpHover(subtitleRef.current, "subtitle");

        return () => {
            cleanupTitle?.();
            cleanupSubtitle?.();
        };
    }, []);

    return (
        <section id="welcome">
            <p ref={subtitleRef}>
                {renderText("Hi, Welcome to my.", "text-3xl font-georama", 100)}
            </p>

            <h1 ref={titleRef} className="mt-7">
                {renderText("Portfolio", "text-9xl italic font-georama")}
            </h1>
        </section>
    );
};

export default Welcome;
