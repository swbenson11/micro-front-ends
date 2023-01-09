import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import { createMemoryHistory } from "history";

const mount = (el) => {
  const history = createMemoryHistory();

  ReactDom.render(<App history={history} />, el);
};

// render element when we are running marketing MFE in isolation
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#_marketing-dev-root");
  if (devRoot) mount(devRoot);
}

export { mount };
