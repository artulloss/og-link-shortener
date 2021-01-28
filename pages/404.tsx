import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  const [seconds, setSeconds] = useState(3);

  setTimeout(() => {
    if (seconds > 1) {
      setSeconds((seconds) => seconds - 1);
    } else {
      window.history.back();
    }
  }, 1000);

  return (
    <div className="w-100">
      <h1 className="text-center">We're sorry, but you seem lost...</h1>
      <p className="text-center">
        Attempting to redirect you back in {seconds}...
        <hr />
        If this fails, please close the window or navigate to the{" "}
        <Link href="/login">
          <a>login page</a>
        </Link>
      </p>
    </div>
  );
}
