"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Operator = "+" | "-" | "*" | "/";

interface CalcState {
  display: string;
  operator: Operator | null;
  prevValue: number | null;
  waitingForOperand: boolean;
}

interface CalcButtonProps {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  variant?: "default" | "secondary" | "operator" | "accent";
}

const INITIAL_STATE: CalcState = {
  display: "0",
  operator: null,
  prevValue: null,
  waitingForOperand: false,
};

const TRAILING_DECIMAL_RE = /\.\d*0$/;

function applyOperator(a: number, op: Operator, b: number): number {
  switch (op) {
    case "+": {
      return a + b;
    }
    case "-": {
      return a - b;
    }
    case "*": {
      return a * b;
    }
    case "/": {
      return b === 0 ? Number.NaN : a / b;
    }
    default: {
      return Number.NaN;
    }
  }
}

function formatDisplay(value: string): string {
  if (value === "Error") {
    return value;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return "Error";
  }
  if (value.endsWith(".") || TRAILING_DECIMAL_RE.test(value)) {
    return value;
  }
  if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(4);
  }
  return value;
}

export default function CalculatorPage() {
  const [state, setState] = useState<CalcState>(INITIAL_STATE);

  function inputDigit(digit: string) {
    setState((s) => {
      if (s.waitingForOperand) {
        return { ...s, display: digit, waitingForOperand: false };
      }
      let newDisplay = s.display;
      if (s.display === "0") {
        newDisplay = digit;
      } else if (s.display.length < 12) {
        newDisplay = `${s.display}${digit}`;
      }
      return { ...s, display: newDisplay };
    });
  }

  function inputDecimal() {
    setState((s) => {
      if (s.waitingForOperand) {
        return { ...s, display: "0.", waitingForOperand: false };
      }
      if (s.display.includes(".")) {
        return s;
      }
      return { ...s, display: `${s.display}.` };
    });
  }

  function clear() {
    setState(INITIAL_STATE);
  }

  function toggleSign() {
    setState((s) => {
      const num = Number(s.display);
      return { ...s, display: String(-num) };
    });
  }

  function percent() {
    setState((s) => {
      const num = Number(s.display);
      return { ...s, display: String(num / 100) };
    });
  }

  function setOperator(op: Operator) {
    setState((s) => {
      const current = Number(s.display);
      if (s.operator && !s.waitingForOperand && s.prevValue !== null) {
        const result = applyOperator(s.prevValue, s.operator, current);
        return {
          display: String(result),
          operator: op,
          prevValue: result,
          waitingForOperand: true,
        };
      }
      return {
        ...s,
        operator: op,
        prevValue: current,
        waitingForOperand: true,
      };
    });
  }

  function calculate() {
    setState((s) => {
      if (!s.operator || s.prevValue === null) {
        return s;
      }
      const current = Number(s.display);
      const result = applyOperator(s.prevValue, s.operator, current);
      return {
        display: Number.isNaN(result) ? "Error" : String(result),
        operator: null,
        prevValue: null,
        waitingForOperand: true,
      };
    });
  }

  const { display, operator } = state;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-bold text-2xl">Calculator</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Simple arithmetic calculator.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-72 rounded-2xl border bg-card p-4 shadow-sm">
          {/* Display */}
          <div className="mb-3 rounded-xl bg-muted px-4 py-3 text-right">
            <div className="h-4 text-muted-foreground text-xs">
              {operator ?? ""}
            </div>
            <div
              className={cn(
                "font-mono font-semibold leading-none",
                display.length > 10 ? "text-lg" : "text-3xl"
              )}
            >
              {formatDisplay(display)}
            </div>
          </div>

          {/* Button grid */}
          <div className="grid grid-cols-4 gap-2">
            <CalcButton onClick={clear} variant="secondary">
              AC
            </CalcButton>
            <CalcButton onClick={toggleSign} variant="secondary">
              +/−
            </CalcButton>
            <CalcButton onClick={percent} variant="secondary">
              %
            </CalcButton>
            <CalcButton
              active={operator === "/"}
              onClick={() => setOperator("/")}
              variant="operator"
            >
              ÷
            </CalcButton>

            <CalcButton onClick={() => inputDigit("7")}>7</CalcButton>
            <CalcButton onClick={() => inputDigit("8")}>8</CalcButton>
            <CalcButton onClick={() => inputDigit("9")}>9</CalcButton>
            <CalcButton
              active={operator === "*"}
              onClick={() => setOperator("*")}
              variant="operator"
            >
              ×
            </CalcButton>

            <CalcButton onClick={() => inputDigit("4")}>4</CalcButton>
            <CalcButton onClick={() => inputDigit("5")}>5</CalcButton>
            <CalcButton onClick={() => inputDigit("6")}>6</CalcButton>
            <CalcButton
              active={operator === "-"}
              onClick={() => setOperator("-")}
              variant="operator"
            >
              −
            </CalcButton>

            <CalcButton onClick={() => inputDigit("1")}>1</CalcButton>
            <CalcButton onClick={() => inputDigit("2")}>2</CalcButton>
            <CalcButton onClick={() => inputDigit("3")}>3</CalcButton>
            <CalcButton
              active={operator === "+"}
              onClick={() => setOperator("+")}
              variant="operator"
            >
              +
            </CalcButton>

            <CalcButton className="col-span-2" onClick={() => inputDigit("0")}>
              0
            </CalcButton>
            <CalcButton onClick={inputDecimal}>.</CalcButton>
            <CalcButton onClick={calculate} variant="accent">
              =
            </CalcButton>
          </div>
        </div>
      </div>
    </main>
  );
}

function CalcButton({
  active = false,
  children,
  className,
  onClick,
  variant = "default",
}: CalcButtonProps) {
  return (
    <button
      className={cn(
        "flex h-14 items-center justify-center rounded-xl font-medium text-lg transition-colors active:scale-95",
        variant === "default" &&
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "secondary" &&
          "bg-muted text-muted-foreground hover:bg-muted/80",
        variant === "operator" &&
          !active &&
          "bg-primary/15 text-primary hover:bg-primary/25",
        variant === "operator" &&
          active &&
          "bg-primary text-primary-foreground",
        variant === "accent" &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
