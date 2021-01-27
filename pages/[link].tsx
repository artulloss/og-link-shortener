import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import NotFound from "./404";
import { NextSeo } from "next-seo";
import RingLoader from "react-spinners/RingLoader";
import { Card } from "react-bootstrap";

export default function Link({ linkData }) {
  useEffect(() => {
    if (window.location && linkData) window.location.replace(linkData.url);
  }, [linkData]);
  const override = `
    display: block;
    margin: 0 auto;
  `;
  return linkData ? (
    <>
      <Card>
        <Card.Body>
          <p className="text-center">Redirecting...</p>
          <RingLoader color="#63C0FF" css={override} size={30} />
        </Card.Body>
      </Card>
    </>
  ) : (
    <NotFound />
  );
}

// This gets called on every request
export async function getServerSideProps({ query }) {
  //console.log("QUERY", query);
  const { link } = query;
  //console.log("LINK", link);

  // // Fetch data from our database
  const document = await db.collection("links").doc(link).get();
  if (!document.exists) return { props: { linkData: null } };
  let linkData = document.data();
  if (!/^https?:\/\//i.test(linkData.url)) {
    linkData.url = "http://" + linkData.url;
  }
  linkData.link = link;
  return { props: { linkData, routeData: { ...linkData } } };
}
