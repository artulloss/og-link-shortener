import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { GetStaticProps } from "next";

const ForgotPassword = () => {
  const emailRef = useRef(null);
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    // @ts-ignore
    resetPassword(emailRef.current!.value).then(
      () => setMessage("Check your inbox for further instructions"), // Success
      (e: any) => {
        // Fail
        setError(e.message);
      }
    );
    setLoading(false);
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Reset
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            <Link href="/login">
              <a>Login</a>
            </Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account?{" "}
        <Link href="/signup">
          <a>Sign up</a>
        </Link>
      </div>
    </>
  );
};

export default ForgotPassword;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { needsAuthProvider: true, routeData: { title: "Forgot Password" } }, // will be passed to the page component as props
  };
};
