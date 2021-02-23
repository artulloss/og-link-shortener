import React, { useState, useRef, useEffect } from "react";
import { Card, Form, Alert, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import { GetStaticProps } from "next";
import { TwitterPicker } from "react-color";

const EditLink = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const urlRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);
  const [color, setColor] = useState("");
  const { currentUser } = useAuth();
  const { link } = router.query;
  const [docId, setDocId] = useState("");

  useEffect(() => {
    db.collection("links")
      .doc(link as string)
      .get()
      .then((document) => {
        const data = document.data();
        if (!data || data.user !== currentUser.uid) {
          // Redirect user, they don't have access to this link
          router.replace("/");
          return;
        }
        setDocId(document.id);
        urlRef.current.value = data.url;
        titleRef.current.value = data.title;
        descriptionRef.current.value = data.description;
        imageRef.current.value = data.image;
        setColor(data.color);
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
        color: color,
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
          <h2 className="text-center mb-4">Edit Link: {docId}</h2>
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

            <Form.Group id="color">
              <p>Color</p>
              <TwitterPicker
                color={color || "#FFF"}
                onChangeComplete={({ hex }) => setColor(hex)}
                triangle="hide"
                width="100%"
              />
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      needsAuthProvider: true,
      routeData: {
        title: "Edit Link",
        description:
          "Some platforms cache meta data, and may not instantly show changes",
      },
    }, // will be passed to the page component as props
  };
};
