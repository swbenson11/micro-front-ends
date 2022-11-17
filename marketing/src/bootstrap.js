import React from "react";
import ReactDom from "react-dom";
import App from "./App";

const mount = (el) => {
  ReactDom.render(<App />, el);
};

// render element when we are running marketing MFE in isolation
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#_marketing-dev-root");
  if (devRoot) mount(devRoot);
}

export { mount };
