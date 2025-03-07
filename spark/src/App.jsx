import React from "react";
import './App.css';
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import DropDown from "./components/DropDown.jsx";

function App() {
  return (
    <div>
        <Header />
        <SearchBar />
        <DropDown />
    </div>
  );
}

export default App;