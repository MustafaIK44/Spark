import React, { useState, useEffect} from "react";
import SearchBar from "./SearchBar.jsx";
import DropDown from "./DropDown.jsx";
import Button from "./Button.jsx";
import Front from "@/Front.jsx";

//notes: https://react.dev/reference/react/useState , https://www.geeksforgeeks.org/react-onsubmit-event/ , 
// https://react.dev/learn/state-a-components-memory , https://medium.com/swlh/creating-forms-with-react-hooks-fe02b6eaad5e

function Header() {
    const availItems = ["Eggs", "Bread", "Milk", "Cereal", "Chicken", "Beef", "Apples", "Paper towels", "Toilet paper"];
    const zipCodes = ["20151", "20153", "22031", "22032", "22033", "22034", "22035", "22036"]
    const zipText = "Zip Code";
    const [searchValue, setSearchValue] = useState("");
    const [selectValue, setSelectValue] = useState("");
    const [result, setResult] = useState("");
    const [search, setSearch] = useState(" ");
    
    function handleSubmit(e) {
        e.preventDefault();
    
        if (selectValue == zipText) {
            setResult("Form has been submitted with with input: " + searchValue);
        } else {
            setResult("Form has been submitted with with input: " + searchValue + " " + selectValue);
        }
        setSearch(searchValue);
    }
    //??
    function handleChange(e) {
        setSearchValue(e.target.value);
        setResult("");
    }
    //??
    function handleSelectChange(e) {
        setSelectValue(e.target.value)
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit} className="flex justify-center items-center gap-4">
                    <SearchBar items={availItems} value={searchValue} onChange={handleChange}/>
                    <DropDown choices={zipCodes} text={zipText} value={selectValue} onChange={handleSelectChange}/>
                    <Button text="Submit" type="submit" className="bg-base-300 text-lg w-20 h-9"/>
                </form>
            </div>
            <div>
                <br />
                <h4>{result}</h4>
            </div>

            <Front search={search}/>
        </div>
    );
}

export default Header;


