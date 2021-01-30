import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import PrivateRoute from "components/PrivateRoute";

const UpdateProfile = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    if (passwordRef.current!.value !== confirmPasswordRef.current!.value) {
      return setError("Passwords must match");
    }

    setLoading(true);
    setError("");

    const promises = [];
    // @ts-ignore
    if (emailRef.current!.value) {
      // @ts-ignore
      promises.push(updateEmail(emailRef.current!.value));
    }
    // @ts-ignore
    if (passwordRef.current!.value) {
      // @ts-ignore
      promises.push(updatePassword(passwordRef.current!.value));
    }

    Promise.all(promises).then(
      () => router.push("/"),
      (e) => setError(e.message)
    );
    setLoading(false);
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={passwordVisible ? "text" : "pas sword"}
                  ref={passwordRef}
                  required={currentUser.isAnonymous}
                  placeholder={
                    !currentUser.isAnonymous &&
                    "Leave blank to keep current password"
                  }
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
            <Form.Group id="confirmPassword">
              <Form.Label>Password Confirmation</Form.Label>
              <InputGroup>
                <Form.Control
                  type={confirmPasswordVisible ? "text" : "password"}
                  ref={confirmPasswordRef}
                  required={currentUser.isAnonymous}
                  placeholder={
                    !currentUser.isAnonymous &&
                    "Leave blank to keep current password"
                  }
                />
                <InputGroup.Append>
                  <InputGroup.Text
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    {confirmPasswordVisible ? (
                      <AiFillEyeInvisible />
                    ) : (
                      <AiFillEye />
                    )}
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link href="/">
          <a>Cancel</a>
        </Link>
      </div>
    </>
  );
};

export default PrivateRoute(UpdateProfile);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { needsAuthProvider: true, routeData: { title: "Update Profile" } }, // will be passed to the page component as props
  };
};
