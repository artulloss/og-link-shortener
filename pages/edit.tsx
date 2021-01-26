import React, { useState, useRef, useEffect } from "react";
import { Card, Form, Alert, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import PrivateRoute from "../components/PrivateRoute";

const EditLink = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const urlRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);
  const { currentUser } = useAuth();
  const { link } = router.query;
  const [docId, setDocId] = useState("");

  useEffect(() => {
    db.collection("links")
      .where("link", "==", link)
      .where("user", "==", currentUser.uid)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size !== 1) {
          // Redirect user, they don't have access to this link
          router.replace("/");
          return;
        }
        const doc = querySnapshot.docs[0];
        const linkData = doc.data();
        setDocId(doc.id);
        urlRef.current.value = linkData.url;
        titleRef.current.value = linkData.title;
        descriptionRef.current.value = linkData.description;
        imageRef.current.value = linkData.image;
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    db.collection("links")
      .doc(docId)
      .update({
        url: urlRef.current.value,
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        image: imageRef.current.value,
        user: currentUser.uid,
      })
      .then(() => {
        setMessage("Successfully edited!");
        setLoading(false);
      });
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Edit Shortlink</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="url">
              <Form.Label>URL</Form.Label>
              <Form.Control type="text" ref={urlRef} required />
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

            <div className="d-flex w-100 justify-content-center">
              <Button disabled={loading} className="m-1 w-100" type="submit">
                Edit
              </Button>
              <Button
                onClick={() => {
                  db.collection("links").doc(docId).delete();
                  router.replace("/"); // Redirect user, this link no longer exists
                }}
                variant="danger"
                disabled={loading}
                className="m-1 w-100"
              >
                Delete
              </Button>
            </div>
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

export default PrivateRoute(EditLink);

export async function getStaticProps(context) {
  return {
    props: { needsAuthProvider: true }, // will be passed to the page component as props
  };
}
