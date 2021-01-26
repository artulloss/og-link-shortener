import React, { useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import PrivateRoute from "../components/PrivateRoute";

const Profile = () => {
  const [error, setError] = useState("");
  console.log("AUTH", useAuth());
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setError("");
    logout().then(
      () => router.push("/login"),
      () => setError("Failed to logout")
    );
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="mb-2 text-center mt-2">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: {currentUser && currentUser.email}</strong>
          <Link href="/update-profile">
            <a className="btn btn-primary w-100 mt-3">Update Profile</a>
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </>
  );
};

export default PrivateRoute(Profile);

export async function getStaticProps(context) {
  return {
    props: { needsAuthProvider: true }, // will be passed to the page component as props
  };
}
