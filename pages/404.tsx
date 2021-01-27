import React, { useState, useEffect } from "react";

export default function NotFound() {
  const [seconds, setSeconds] = useState(3);

  setTimeout(() => {
    if (seconds > 1) {
      setSeconds((seconds) => seconds - 1);
    } else {
      window.history.back(); // Redirect back
    }
  }, 1000);

  return (
    <div className="w-100">
      <h1 className="text-center">We're sorry, but you seem lost...</h1>
      <p className="text-center">Redirecting you back in {seconds}...</p>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      routeData: {
        title: "Not Found",
        description: "We're sorry, you seem lost!",
      },
    }, // will be passed to the page component as props
  };
}
