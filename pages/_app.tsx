import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "contexts/AuthContext";
import React from "react";
import { Container } from "react-bootstrap";

function MyApp({ Component, pageProps }) {
  //console.log({ pageProps });
  return (
    <Container
      className="d-flex alight-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100 mt-5" style={{ maxWidth: "400px" }}>
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
