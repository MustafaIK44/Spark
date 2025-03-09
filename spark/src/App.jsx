import React from "react";
import './App.css';
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import DropDown from "./components/DropDown.jsx";
import Button from "./components/Button.jsx";

function App() {
  const availItems = ["Eggs", "Bread", "Milk", "Cereal", "Chicken", "Beef", "Apples", "Paper towels", "Toilet paper"];
  const zipCodes = ["20151", "20153", "22031", "22032", "22033", "22034", "22035", "22036"]
  return (
    <div>
        <Header />
        <SearchBar items={availItems}/>
        <DropDown text ="Zip Codes" choices={zipCodes}/>
        <Button text="Submit"/>
    </div>
  );
}

export default App;