import React from "react";
import { Button } from "react-bootstrap";

export default function NotFound() {
  return (
    <div>
      <h1>We're sorry, but you seem lost...</h1>
      <Button onClick={() => window.history.back()}>Go back</Button>
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
