import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
export const useIntersection = (ref, rootMargin) => {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            setIsIntersecting(entry.isIntersecting);
            observer.disconnect();
        }
    }, { rootMargin }
    );

    useEffect(() => {
        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref, observer]);

    return isIntersecting;
};