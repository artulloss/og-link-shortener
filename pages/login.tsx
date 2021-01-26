import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    login(emailRef.current!.value, passwordRef.current!.value).then(
      () => setTimeout(() => router.push("/"), 250),
      (e: any) => {
        // Fail
        alert(e.message);
        setError(e.message);
      }
    );
    setLoading(false);
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  ref={passwordRef}
                  required
                />
                <InputGroup.Append>
                  <InputGroup.Text
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Login
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            <Link href="/forgot-password">
              <a>Forgot password?</a>
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

export default Login;

export async function getStaticProps(context) {
  return {
    props: { needsAuthProvider: true }, // will be passed to the page component as props
  };
}
