import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { useAuth, OAuthType } from "../contexts/AuthContext";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaGithub, FaGoogle } from "react-icons/fa";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { login, loginOAuth, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const redirect = () => setTimeout(() => router.push("/"), 250);
  const fail = (e: any) => {
    setLoading(false);
    setError(e.message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    login(emailRef.current!.value, passwordRef.current!.value).then(
      redirect,
      fail
    );
    setLoading(false);
  };

  const handleOAuth = (oauth: OAuthType) => {
    if (loading) return;
    setLoading(true);
    loginOAuth(oauth).then(redirect, fail);
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
            <span className="d-flex justify-content-center m-1">
              <FaGithub
                onClick={() => handleOAuth(OAuthType.Github)}
                className={
                  (loading ? "oauth-icon-disabled" : "oauth-icon") + " mx-1"
                }
              />
              <FaGoogle
                onClick={() => handleOAuth(OAuthType.Google)}
                className={
                  (loading ? "oauth-icon-disabled" : "oauth-icon") + " mx-1"
                }
              />
            </span>
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
    props: { needsAuthProvider: true, routeData: { title: "Login" } }, // will be passed to the page component as props
  };
}
