// Filename - App.js
import React, { useState } from "react";
import SearchBar from "./SearchBar.jsx"

function Header() {
    const availItems = ["Eggs", "Bread", "Milk", "Cereal", "Chicken", "Beef", "Apples", "Paper towels", "Toilet paper"];
    const zipCodes = ["20151", "20153", "22031", "22032", "22033", "22034", "22035", "22036"]
    const [searchValue, setSearchValue] = useState("");
    const [result, setResult] = useState("");
    function handleSubmit(e) {
        e.preventDefault();
        setResult("Form has been submitted with with input: " + searchValue);
    }

    function handleChange(e) {
        setSearchValue(e.target.value);
        setResult("");
    }
    return (
        <div className="flex items-center gap-4">
            <form onSubmit={handleSubmit}>
                <SearchBar items={availItems} value={searchValue} onChange={handleChange}/>
                <button type="submit"> Submit </button>
            </form>
            <br />
            <div>
                <h4>{result}</h4>
            </div>
        </div>
    );
}

export default Header;


