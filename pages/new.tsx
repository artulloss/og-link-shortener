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
  let shortLink = "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const links = db.collection("links");
    shortLink = linkRef.current.value;
    links
      .where("link", "==", shortLink)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size !== 0) {
          setError(`Shortlink ${shortLink} is taken`);
        }
      })
      .then(() => {
        links
          .add({
            url: urlRef.current.value,
            link: shortLink,
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            image: imageRef.current.value,
            user: currentUser.uid,
          })
          .then((/*docRef*/) => {
            const url = `${window.location.host}/${shortLink}`;
            if (!error) return;
            if (copy(url)) {
              setMessage("Success, copied to clipboard!");
            } else {
              setMessage("Success, created at " + url);
            }
            //console.log("Document written with ID: ", docRef.id);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Create Shortlink</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="url">
              <Form.Label>URL</Form.Label>
              <Form.Control type="text" ref={urlRef} required />
            </Form.Group>

            <Form.Group id="shortlink">
              <Form.Label>Shortlink</Form.Label>
              <Form.Control type="text" ref={linkRef} required />
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
