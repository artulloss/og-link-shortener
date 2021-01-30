import React, { useEffect } from "react";
import { db } from "../firebase";
import NotFound from "./404";
import RingLoader from "react-spinners/RingLoader";
import { Card } from "react-bootstrap";
import { GetServerSideProps } from "next";

export default function Link({ linkData }) {
  useEffect(() => {
    if (window.location && linkData) window.location.replace(linkData.url);
  }, [linkData]);
  const override = `
    display: block;
    margin: 0 auto;
  `;
  return (
    <>
      <Card>
        <Card.Body>
          <p className="text-center">Redirecting...</p>
          <RingLoader color="#63C0FF" css={override} size={30} />
        </Card.Body>
      </Card>
    </>
  );
}

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { link } = query;
  // Fetch data from our database
  const document = await db
    .collection("links")
    .doc(link as string)
    .get();
  if (!document.exists) return { notFound: true };
  let linkData = document.data();
  if (!/^https?:\/\//i.test(linkData.url)) {
    linkData.url = "http://" + linkData.url;
  }
  linkData.link = link;
  return { props: { linkData, routeData: { ...linkData } } };
};
