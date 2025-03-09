import React from "react";
import './App.css';
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import DropDown from "./components/DropDown.jsx";
import Button from "./components/Button.jsx";

function App() {
  return (
    <div>
        <Header />
        <SearchBar />
        <DropDown text = "Zip Codes"/>
        <Button text="Submit"/>
    </div>
  );
}

export default App;