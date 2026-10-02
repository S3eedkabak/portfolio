"use client";

import { cn } from "../../lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ChevronUp,
  Command,
  Globe,
  LayoutGrid,
  Lock,
  Mic,
  Moon,
  Option,
  Play,
  Search,
  SkipBack,
  SkipForward,
  Sun,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import * as React from "react";

// Context to share active keys state
const KeyboardContext = React.createContext<{
  activeKeys: Set<string>;
}>({
  activeKeys: new Set(),
});

export interface MacKeyProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  subLabel?: React.ReactNode;
  icon?: React.ReactNode;
  iconLabel?: string;
  width?: number;
  keyCode?: string | string[]; // Can be a single code or array of codes
  noAspectRatio?: boolean; // Skip aspect-ratio on wrapper (for arrow half-height keys)
}

interface MacKeyboardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Optional prop to provide a custom sound URL
  soundSrc?: string;
  // Additional key codes to animate while demonstrating a sequence.
  highlightedKeys?: string[];
}

export function MacKeyboard({ className, soundSrc = "/audio/key-press.wav", highlightedKeys = [], ...props }: MacKeyboardProps) {
  const [activeKeys, setActiveKeys] = React.useState<Set<string>>(new Set());
  const visibleActiveKeys = React.useMemo(
    () => new Set([...activeKeys, ...highlightedKeys]),
    [activeKeys, highlightedKeys],
  );
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const audioBufferRef = React.useRef<AudioBuffer | null>(null);

  React.useEffect(() => {
    if (!soundSrc) return;
    // Use Web Audio API for low-latency, short key click sounds
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;

    fetch(soundSrc)
      .then((res) => res.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => { audioBufferRef.current = decoded; })
      .catch(() => {}); // Silently fail if audio can't load

    return () => { ctx.close().catch(() => {}); };
  }, [soundSrc]);

  const playClick = React.useCallback(() => {
    const ctx = audioCtxRef.current;
    const buffer = audioBufferRef.current;
    if (!ctx || !buffer) return;

    const play = () => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.value = 0.15; // Set volume very low (15%) so it's a subtle click

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(play).catch(() => {});
    } else {
      play();
    }
  }, []);

  React.useEffect(() => {
    const clearActiveKeys = () => setActiveKeys(new Set());
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      setActiveKeys((prev) => {
        const newSet = new Set(prev);
        newSet.add(e.code);
        return newSet;
      });

      playClick();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.code);
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearActiveKeys);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearActiveKeys);
    };
  }, [playClick]);

  return (
    <KeyboardContext.Provider value={{ activeKeys: visibleActiveKeys }}>
      {props.children ? (
        <div
          className={cn("componentry-keyboard-shell", className)}
          role="group"
          aria-label="Custom Mac keyboard"
          {...props}
        >
          {props.children}
        </div>
      ) : (
        <div
          className={cn(
            "componentry-keyboard-shell componentry-keyboard-layout",
            className
          )}
          role="group"
          aria-label="Mac keyboard"
          style={{ minWidth: 0 }}
          {...props}
        >
          {/* Row 1: Esc, F1-F12, Touch ID */}
          <Row>
            <MacKey width={1.5} keyCode="Escape" className="key-escape">esc</MacKey>
            <MacKey width={1} keyCode="F1" icon={<Sun />} iconLabel="F1" />
            <MacKey width={1} keyCode="F2" icon={<Sun />} iconLabel="F2" />
            <MacKey width={1} keyCode="F3" icon={<LayoutGrid />} iconLabel="F3" />
            <MacKey width={1} keyCode="F4" icon={<Search />} iconLabel="F4" />
            <MacKey width={1} keyCode="F5" icon={<Mic />} iconLabel="F5" />
            <MacKey width={1} keyCode="F6" icon={<Moon />} iconLabel="F6" />
            <MacKey width={1} keyCode="F7" icon={<SkipBack />} iconLabel="F7" />
            <MacKey width={1} keyCode="F8" icon={<Play />} iconLabel="F8" />
            <MacKey width={1} keyCode="F9" icon={<SkipForward />} iconLabel="F9" />
            <MacKey width={1} keyCode="F10" icon={<VolumeX />} iconLabel="F10" />
            <MacKey width={1} keyCode="F11" icon={<Volume1 />} iconLabel="F11" />
            <MacKey width={1} keyCode="F12" icon={<Volume2 />} iconLabel="F12" />
            <MacKey width={1} icon={<Lock />} />
          </Row>

      {/* Row 2: Numbers */}
      <Row>
        <MacKey width={1} label="`" subLabel="~" />
        <MacKey width={1} label="1" subLabel="!" />
        <MacKey width={1} label="2" subLabel="@" />
        <MacKey width={1} label="3" subLabel="#" />
        <MacKey width={1} label="4" subLabel="$" />
        <MacKey width={1} label="5" subLabel="%" />
        <MacKey width={1} label="6" subLabel="^" />
        <MacKey width={1} label="7" subLabel="&" />
        <MacKey width={1} label="8" subLabel="*" />
        <MacKey width={1} label="9" subLabel="(" />
        <MacKey width={1} label="0" subLabel=")" />
        <MacKey width={1} label="-" subLabel="_" />
        <MacKey width={1} label="=" subLabel="+" />
        <MacKey width={1.5} keyCode="Backspace" className="key-delete" label="delete" />
      </Row>

      {/* Row 3: Tab */}
      <Row>
        <MacKey width={1.5} keyCode="Tab" className="key-tab" label="tab" />
        <MacKey width={1} label="Q" />
        <MacKey width={1} label="W" />
        <MacKey width={1} label="E" />
        <MacKey width={1} label="R" />
        <MacKey width={1} label="T" />
        <MacKey width={1} label="Y" />
        <MacKey width={1} label="U" />
        <MacKey width={1} label="I" />
        <MacKey width={1} label="O" />
        <MacKey width={1} label="P" />
        <MacKey width={1} label="[" subLabel="{" />
        <MacKey width={1} label="]" subLabel="}" />
        <MacKey width={1} label="\" subLabel="|" />
      </Row>

      {/* Row 4: Caps */}
      <Row>
        <MacKey width={1.75} keyCode="CapsLock" className="key-caps" label="">
           <span className="key-caps-label">caps lock</span>
           <span className="key-caps-light" aria-hidden="true" />
        </MacKey>
        <MacKey width={1} label="A" />
        <MacKey width={1} label="S" />
        <MacKey width={1} label="D" />
        <MacKey width={1} label="F" />
        <MacKey width={1} label="G" />
        <MacKey width={1} label="H" />
        <MacKey width={1} label="J" />
        <MacKey width={1} label="K" />
        <MacKey width={1} label="L" />
        <MacKey width={1} label=";" subLabel=":" />
        <MacKey width={1} label="'" subLabel='"' />
        <MacKey width={1.75} keyCode="Enter" className="key-return" label="return" />
      </Row>

      {/* Row 5: Shift */}
      <Row>
        <MacKey width={2.25} keyCode="ShiftLeft" className="key-shift key-shift-left" label="shift" />
        <MacKey width={1} label="Z" />
        <MacKey width={1} label="X" />
        <MacKey width={1} label="C" />
        <MacKey width={1} label="V" />
        <MacKey width={1} label="B" />
        <MacKey width={1} label="N" />
        <MacKey width={1} label="M" />
        <MacKey width={1} label="," subLabel="<" />
        <MacKey width={1} label="." subLabel=">" />
        <MacKey width={1} label="/" subLabel="?" />
        <MacKey width={2.25} keyCode="ShiftRight" className="key-shift key-shift-right" label="shift" />
      </Row>

      {/* Row 6: Bottom */}
      <Row>
        <MacKey
          width={1}
          className="key-modifier key-fn"
          label="fn"
        >
          <Globe className="key-modifier-icon" />
        </MacKey>
        <MacKey
          width={1}
          keyCode="ControlLeft"
          className="key-modifier key-control"
          label="control"
        >
          <ChevronUp className="key-modifier-icon" />
        </MacKey>
        <MacKey
          width={1.25}
          keyCode="AltLeft"
          className="key-modifier key-option"
          label="option"
        >
          <Option className="key-modifier-icon" />
        </MacKey>
        <MacKey
          width={1.5}
          keyCode="MetaLeft"
          className="key-modifier key-command"
          label="command"
        >
          <Command className="key-modifier-icon" />
        </MacKey>
        {/* Spacebar */}
        <MacKey width={4} keyCode="Space" /> 
        <MacKey
          width={1.5}
          keyCode="MetaRight"
          className="key-modifier key-command"
          label="command"
        >
           <Command className="key-modifier-icon key-icon-right" />
        </MacKey>
        <MacKey
          width={1.25}
          keyCode="AltRight"
          className="key-modifier key-option"
          label="option"
        >
           <Option className="key-modifier-icon key-icon-right" />
        </MacKey>
        
        {/* Arrow keys */}
        <div style={{ flex: 3 }} className="componentry-arrow-cluster">
          <MacKey width={1} keyCode="ArrowLeft" className="key-arrow">
            <ArrowLeft />
          </MacKey>
          <div className="componentry-arrow-pair">
            <MacKey
              width={1}
              noAspectRatio
              keyCode="ArrowUp"
              style={{ flex: 1 }}
              className="key-arrow-half"
            >
              <ArrowUp />
            </MacKey>
            <MacKey
              width={1}
              noAspectRatio
              keyCode="ArrowDown"
              style={{ flex: 1 }}
              className="key-arrow-half"
            >
              <ArrowDown />
            </MacKey>
          </div>
          <MacKey width={1} keyCode="ArrowRight" className="key-arrow">
            <ArrowRight />
          </MacKey>
        </div>
      </Row>
        </div>
      )}
    </KeyboardContext.Provider>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="componentry-keyboard-row">{children}</div>;
}

export function MacKey({
  className,
  label,
  subLabel,
  icon,
  iconLabel,
  width = 1,
  children,
  keyCode,
  noAspectRatio,
  ...props
}: MacKeyProps) {
  const { activeKeys } = React.useContext(KeyboardContext);

  const isActive = React.useMemo(() => {
    // 1. Check explicit keyCode prop
    if (keyCode) {
      if (Array.isArray(keyCode)) {
        return keyCode.some((code) => activeKeys.has(code));
      }
      return activeKeys.has(keyCode);
    }

    // 2. Try to infer from label (simple cases)
    if (typeof label === "string") {
      const l = label.toLowerCase();
      
      // Numbers
      if (/^[0-9]$/.test(l)) return activeKeys.has(`Digit${l}`);
      
      // Letters
      if (/^[a-z]$/.test(l)) return activeKeys.has(`Key${l.toUpperCase()}`);

      // Common symbols
      const symbolMap: Record<string, string> = {
        "-": "Minus",
        "=": "Equal",
        "[": "BracketLeft",
        "]": "BracketRight",
        "\\": "Backslash",
        ";": "Semicolon",
        "'": "Quote",
        ",": "Comma",
        ".": "Period",
        "/": "Slash",
        "`": "Backquote",
        "delete": "Backspace",
        "tab": "Tab", 
        "caps lock": "CapsLock",
        "return": "Enter",
        "space": "Space"
      };
      
      if (symbolMap[l]) return activeKeys.has(symbolMap[l]);
    }
    
    return false;
  }, [activeKeys, keyCode, label]);

  // For width=1 keys, use aspect-ratio to define the row height.
  // For wider keys, omit aspect-ratio so they stretch to the row height via align-items: stretch.
  const applyAspectRatio = !noAspectRatio;
  return (
    <div
      style={{
        flex: width,
        ...(applyAspectRatio ? { aspectRatio: `${width}/1` } : {}),
      }}
      className="componentry-key-wrapper"
    >
      <div
        className={cn(
          "componentry-key",

          // Light mode shadows
          
          // Dark mode overrides
          
          // Active state styles - mimicking the active: pseudo-class but triggered by state
          isActive && "componentry-key-active",
          "",
          className
        )}
        {...props}
      >
        {/* Icon only keys (F-keys) */}
        {icon && !label && !subLabel && !children && (
           <div className="componentry-icon-key-content">
              <span className="componentry-key-icon">{icon}</span>
              {iconLabel && <span className="componentry-key-icon-label">{iconLabel}</span>}
           </div>
        )}

        {/* Number/Symbol keys */}
        {subLabel && (
          <div className="componentry-number-key-content">
             <span className="componentry-key-symbol">{subLabel}</span>
             <span className="componentry-key-label">{label}</span>
          </div>
        )}
        
        {/* Letter keys */}
        {!subLabel && !icon && typeof label === "string" && label.length === 1 && (
          <span className="componentry-key-letter">{label}</span>
        )}

        {/* Modifier keys with text label */}
        {!subLabel && !icon && typeof label === "string" && label.length > 1 && (
          <span className="componentry-key-wide-label">{label}</span>
        )}
        
        {children}
      </div>
    </div>
  );
}
