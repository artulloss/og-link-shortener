import React, { useState, useEffect } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { BsGearFill } from "react-icons/bs";
import copy from "copy-to-clipboard";
import { useAuth } from "../contexts/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import { db } from "../firebase";
import { DefaultMeta } from "./_app";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  //console.log("AUTH", useAuth());
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setError("");
    logout().then(
      () => router.push("/login"),
      () => setError("Failed to logout")
    );
  };

  const copyURL = (url: string) => {
    if (copy(url)) {
      setMessage("Copied to clipboard");
      setTimeout(() => setMessage(""), 5000);
    } else {
      setError("Failed to copy");
    }
  };

  const [links, setLinks] = useState([]);

  useEffect(() => {
    db.collection("links")
      .where("user", "==", currentUser.uid) // TODO When testing security rules uncomment this for error if working correctly
      .get()
      .then(({ docs }) => {
        setLinks((links) => [
          ...links,
          ...docs.map((d) => ({ ...d.data(), link: d.id })),
        ]);
      })
      .catch((e) => {
        setError("Failed to fetch links");
        console.log(e);
      });
  }, []);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="mb-2 text-center mt-2">My Links</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          {links.map((link) => {
            return (
              <div
                key={link.link}
                className="card mb-3"
                style={{ maxWidth: "540px" }}
              >
                <div className="row no-gutters">
                  <div className="col-md-4 d-flex align-items-center">
                    <img
                      src={link.image || DefaultMeta.image}
                      className="card-img"
                      alt={link.title}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h5
                          onClick={() =>
                            copyURL(window.location.host + "/" + link.link)
                          }
                          className="card-title link"
                        >
                          {link.title || DefaultMeta.title}
                        </h5>

                        <Link href={"/edit?link=" + link.link}>
                          <BsGearFill />
                        </Link>
                      </span>
                      <p className="card-text">
                        {link.description || DefaultMeta.description}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 w-100">
                    <hr />
                    <div className="container-scroll-x">
                      <p className="text-center w-100">{link.url}</p>
                    </div>
                  </span>
                </div>
              </div>
            );
          })}

          <Link href="/new">
            <a className="btn btn-primary w-100 mt-3">Create Link</a>
          </Link>
          <Link href="/update-profile">
            <a className="btn btn-secondary w-100 mt-3">Update Profile</a>
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

export default PrivateRoute(Dashboard);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { needsAuthProvider: true }, // will be passed to the page component as props
  };
};
