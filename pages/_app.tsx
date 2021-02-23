import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "contexts/AuthContext";
import React from "react";
import { Container } from "react-bootstrap";
import { NextSeo } from "next-seo";
import type { AppProps } from "next/app";

export const DefaultMeta = {
  title: "Open Graph Link Shortener",
  description: "Shorten your links and use custom social previews!",
  image: "https://ogp.me/logo.png",
  color: "#007bff",
};

function MyApp({ Component, pageProps }: AppProps) {
  console.log({ pageProps });
  const routeData = pageProps.routeData;
  const seo = (
    <NextSeo
      title={(routeData && routeData.title) || DefaultMeta.title}
      description={
        (routeData && routeData.description) || DefaultMeta.description
      }
      openGraph={{
        type: "website",
        title: (routeData && routeData.title) || DefaultMeta.title,
        description:
          (routeData && routeData.description) || DefaultMeta.description,
        images: [
          {
            url: (routeData && routeData.image) || DefaultMeta.image,
          },
        ],
      }}
      additionalMetaTags={[
        {
          name: "theme-color",
          content: (routeData && routeData.color) || DefaultMeta.color,
        },
      ]}
    />
  );
  return pageProps.customLayout ? ( // Custom page layout escapes the container, keeps seo etc
    <>
      {seo}
      {pageProps.needsAuthProvider ? ( // Only give us AuthProvider if the page needs it
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  ) : (
    <Container
      className="d-flex alight-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      {seo}
      <div className="w-100 mt-5 mb-5" style={{ maxWidth: "400px" }}>
        {pageProps.needsAuthProvider ? ( // Only give us AuthProvider if the page needs it
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </div>
    </Container>
  );
}

export default MyApp;
