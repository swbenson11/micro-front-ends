import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import { createBrowserHistory, createMemoryHistory } from "history";

const mount = (el, { onNavigate, defaultHistory, initialPath }) => {
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [initialPath],
    });

  ReactDom.render(<App history={history} />, el);

  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location;

      if (pathname !== nextPathname) {
        history.push(nextPathname);
      }
    },
  };
};

// render element when we are running marketing MFE in isolation
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#_marketing-dev-root");
  if (devRoot)
    mount(devRoot, {
      onNavigate: () => {},
      defaultHistory: createBrowserHistory(),
    });
}

export { mount };
