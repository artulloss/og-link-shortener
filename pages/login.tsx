import React, { useRef, useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  InputGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth, OAuthType, AuthProvider } from "../contexts/AuthContext";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaGithub, FaGoogle, FaMicrosoft } from "react-icons/fa";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { login, loginOAuth, loginAnonymous } = useAuth();
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

  const handleAnonymousLogin = () => {
    if (loading) return;
    setLoading(true);
    loginAnonymous().then(redirect, fail);
  };

  return (
    <>
      <Container
        fluid
        className="d-flex alight-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100 mt-5 mb-5" style={{ maxWidth: "900px" }}>
          <Row xs={1} md={2}>
            <Col>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <h2 className="text-center mb-4">
                    Open Graph Link Shortener
                  </h2>
                  <p>
                    Shorten links and customize the social media previews, while
                    optionally editing them afterwards! This project is open
                    source and is hosted via a deployment to Vercel. Check out
                    the project on{" "}
                    <a href="https://github.com/artulloss/og-link-shortener">
                      Github
                    </a>
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col>
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
                            {passwordVisible ? (
                              <AiFillEyeInvisible />
                            ) : (
                              <AiFillEye />
                            )}
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">
                      Login
                    </Button>
                  </Form>
                  <div className="w-100 text-center mt-2">
                    <Link href="/signup">
                      <a>Sign up</a>
                    </Link>
                    <br />
                    <Link href="/forgot-password">
                      <a>Forgot password?</a>
                    </Link>
                  </div>
                  <hr />

                  <p>Socials</p>
                  <span className="d-flex justify-content-center m-1">
                    <FaGoogle
                      onClick={() => handleOAuth(OAuthType.Google)}
                      className={
                        (loading ? "oauth-icon-disabled" : "oauth-icon") +
                        " mx-1"
                      }
                    />
                    <FaMicrosoft
                      onClick={() => handleOAuth(OAuthType.Microsoft)}
                      className={
                        (loading ? "oauth-icon-disabled" : "oauth-icon") +
                        " mx-1"
                      }
                    />
                    <FaGithub
                      onClick={() => handleOAuth(OAuthType.Github)}
                      className={
                        (loading ? "oauth-icon-disabled" : "oauth-icon") +
                        " mx-1"
                      }
                    />
                  </span>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="w-100 text-center mt-2">
            <p
              onClick={handleAnonymousLogin}
              className={loading ? "link-disabled" : "link"}
            >
              Sign in Anonymously
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      needsAuthProvider: true,
      customLayout: true,
      routeData: { title: "Login" },
    }, // will be passed to the page component as props
  };
};
