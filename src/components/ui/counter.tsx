"use client";

import React from "react";
import CountUp from "react-countup";

type CounterProps = {
  number: number;
  title?: string;
  /** seconds (default: 10) */
  duration?: number;
  /** wrapper class (default: "number") */
  className?: string;
  /** CountUp class (default: "counter") */
  counterClassName?: string;
  /** title <span> class */
  titleClassName?: string;
};

export default function Counter({
  number,
//   title,
  duration = 10,
  className = "number",
  counterClassName = "counter",
//   titleClassName,
}: CounterProps) {
  return (
    <div className={className}>
      <CountUp duration={duration} className={counterClassName} end={number} />
      {/* <span className={titleClassName}>{title}</span> */}
    </div>
  );
}
