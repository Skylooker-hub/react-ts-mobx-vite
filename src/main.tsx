import React from "react";
import ReactDOM from "react-dom";
import App from "src/App";
import { StoreContext, store } from "src/stores/rootStore";

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
