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
