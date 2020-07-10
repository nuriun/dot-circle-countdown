import React from "react";
import ReactDOM from "react-dom";
import CountDown from "./countDown";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <CountDown />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
