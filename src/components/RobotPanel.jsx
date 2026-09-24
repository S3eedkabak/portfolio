import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

export default function RobotPanel() {
  return (
    <div className="contact-robot">
      <Suspense fallback={<div className="contact-robot-loader" />}>
        <Spline scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="contact-robot-scene" />
      </Suspense>
    </div>
  );
}