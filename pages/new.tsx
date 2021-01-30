import React, { useState, useRef, useEffect, SyntheticEvent } from "react";
import { Card, Form, Alert, Button } from "react-bootstrap";
import Link from "next/link";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import copy from "copy-to-clipboard";
import PrivateRoute from "../components/PrivateRoute";
import ogs from "open-graph-scraper";
import { GetServerSideProps } from "next";

const validUrl = (url: string) => {
  const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  return url.match(regex);
};

const CreateLink = (props) => {
  const [metaData, setMetaData] = useState(props.metaData);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [alt, setAlt] = useState("");
  const linkRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!metaData) return;
    setUrl(metaData.requestUrl || "");
    titleRef.current.value = metaData.ogTitle || "";
    descriptionRef.current.value = metaData.ogDescription || "";
    setImgUrl(
      (metaData.ogImage && metaData.ogImage.url) ||
        (metaData.ogImage && metaData.ogImage[0] && metaData.ogImage[0].url) ||
        ""
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link =
      linkRef.current.value || Math.random().toString(36).substring(7);

    if (!validUrl(url)) {
      setError("Invalid URL");
      setMessage("");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    const dbLinkRef = db.collection("links").doc(link);
    dbLinkRef
      .get()
      .then(async ({ exists }) => {
        if (exists) {
          setError(`Link ${link} is taken`);
          return;
        }
        try {
          await dbLinkRef.set({
            url: url,
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            image: imgUrl,
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

  const handleScrape = () => {
    if (!validUrl(url)) {
      setError("Invalid URL");
      return;
    }
    window.location.href = "/new?scrape=" + url;
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
              <Form.Control
                type="text"
                onInput={(v: SyntheticEvent) => {
                  setMetaData(null);
                  setUrl((v.nativeEvent as InputEvent).target?.value);
                }}
                defaultValue={url}
                required
              />
            </Form.Group>

            <Form.Group id="link">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                ref={linkRef}
                disabled={currentUser.isAnonymous}
                placeholder={
                  (currentUser.isAnonymous &&
                    "Anonymous users can't choose their link") ||
                  ""
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
              <Form.Control
                type="text"
                onInput={(v: SyntheticEvent) => {
                  setImgUrl((v.nativeEvent as InputEvent).target?.value);
                  setAlt(""); // Clear alt
                }}
                defaultValue={imgUrl}
              />
            </Form.Group>

            {imgUrl && (
              <>
                <p>Image Preview</p>
                <img
                  src={imgUrl}
                  onError={(e) => setAlt("Image is invalid or corrupted")}
                  alt={alt}
                  width="100%"
                />
              </>
            )}

            <div className="d-flex">
              <Button
                disabled={metaData}
                variant="warning "
                className="w-100 m-3"
                onClick={handleScrape}
              >
                Scrape
              </Button>
              <Button disabled={loading} className="w-100 m-3" type="submit">
                Create Link
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

export default PrivateRoute(CreateLink);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let url: string = query.scrape as string;
  if (!/^https?:\/\//i.test(url)) {
    url = "http://" + url;
  }
  if (!validUrl(url))
    return {
      props: {
        needsAuthProvider: true,
        routeData: { title: "New Link" },
      }, // will be passed to the page component as props
    };

  const data = await ogs({ url });
  const metaData = data.result;
  return {
    props: {
      metaData,
      needsAuthProvider: true,
      routeData: { title: "New Link" },
    }, // will be passed to the page component as props
  };
};
