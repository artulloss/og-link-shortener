import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "contexts/AuthContext";
import React from "react";
import { Container } from "react-bootstrap";
import { NextSeo } from "next-seo";

export const DefaultMeta = {
  title: "Open Graph Link Shortener",
  description: "Shorten your links and use custom social previews!",
  image: "https://ogp.me/logo.png",
};

function MyApp({ Component, pageProps }) {
  //console.log({ pageProps });
  const routeData = pageProps.routeData;
  return (
    <Container
      className="d-flex alight-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100 mt-5" style={{ maxWidth: "400px" }}>
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
        />
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
