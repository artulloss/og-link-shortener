import React, { useState, useRef } from "react";
import { Card, Form, Alert, Button } from "react-bootstrap";
import Link from "next/link";

import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import copy from "copy-to-clipboard";
import PrivateRoute from "../components/PrivateRoute";

const CreateLink = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const urlRef = useRef(null);
  const linkRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);
  const { currentUser } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link =
      linkRef.current.value || Math.random().toString(36).substring(7);
    const url = urlRef.current.value;
    const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    console.log({ url }, url.match(regex));
    if (!url.match(regex)) {
      setError("Invalid URL");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    const dbLinkRef = db.collection("links").doc(link);
    dbLinkRef
      .get()
      .then(async ({ exists }) => {
        console.log({ exists });
        if (exists) {
          setError(`Link ${link} is taken`);
          return;
        }
        try {
          await dbLinkRef.set({
            url: url,
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            image: imageRef.current.value,
            user: currentUser.uid,
          });
          const copyUrl = `${window.location.host}/${link}`;
          if (copy(copyUrl)) {
            setMessage("Success, copied to clipboard!");
          } else {
            setMessage("Success, created at " + copyUrl);
          }
        } catch {
          console.error("Error adding document: ", error);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Create Link</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="url">
              <Form.Label>URL</Form.Label>
              <Form.Control type="text" ref={urlRef} required />
            </Form.Group>

            <Form.Group id="link">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                ref={linkRef}
                disabled={currentUser.isAnonymous}
                placeholder={
                  currentUser.isAnonymous &&
                  "Anonymous users can't choose their link"
                }
              />
            </Form.Group>

            <Form.Group id="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" ref={titleRef} />
            </Form.Group>

            <Form.Group id="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" ref={descriptionRef} />
            </Form.Group>

            <Form.Group id="image">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" ref={imageRef} />
            </Form.Group>

            <Button disabled={loading} className="w-100" type="submit">
              Create Link
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            <Link href="/">
              <a>Back</a>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default PrivateRoute(CreateLink);

export async function getStaticProps(context) {
  return {
    props: { needsAuthProvider: true, routeData: { title: "New Link" } }, // will be passed to the page component as props
  };
}
