import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { target: 15, suffix: "+", label: "Brew Locations" },
  { target: 8,  suffix: "",  label: "Years of Craft" },
  { target: 60, suffix: "+", label: "Coffee Blends" },
  { target: 500, suffix: "+", label: "Happy Sippers" },
];

function useCountUp(target: number, duration: number = 1800, active: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return count;
}

function StatBox({ item, active }: { item: StatItem; active: boolean }) {
  const count = useCountUp(item.target, 1800, active);
  return (
    <Stack className="static-box">
      <Box className="static-num">
        {count}{item.suffix}
      </Box>
      <Box className="static-text">{item.label}</Box>
    </Stack>
  );
}

export default function Statistics() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={"static-frame"} ref={ref}>
      <Container>
        <Stack className="info">
          {stats.map((item, index) => (
            <React.Fragment key={item.label}>
              <StatBox item={item} active={active} />
              {index < stats.length - 1 && (
                <Divider height="70" width="1" bg="#e8c97a" />
              )}
            </React.Fragment>
          ))}
        </Stack>
      </Container>
    </div>
  );
}