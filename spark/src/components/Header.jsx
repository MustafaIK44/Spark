import React, { useState, useEffect} from "react";
import SearchBar from "./SearchBar.jsx";
import DropDown from "./DropDown.jsx";
import Button from "./Button.jsx";
import Front from "@/Front.jsx";
import HamburgerMenu from "./HamburgerMenu.jsx";
import "./Header.css";

function Header() {
    //hard-coded arrays that MUST be replaced by database fetches
    const availItems = ["Eggs", "Bread", "Milk", "Cereal", "Chicken", "Beef", "Apples", "Paper towels", "Toilet paper"];
    const zipCodes = ["22030", "22031", "22032", "22015", "22151"];
    //constants that set values, which are to be used with searching through the database
    const zipText = "Zip Code";
    const [searchValue, setSearchValue] = useState("");
    const [zipValue, setZipValue] = useState("");
    const [zip, setZip] = useState("22030");
    const [search, setSearch] = useState(" ");
    
    function handleSubmit(e) {
        e.preventDefault();
        setSearch(searchValue);
        if (zipValue != "Zip Code") {
            setZip(zipValue);
        }
    }
    //??
    function handleChange(e) {
        setSearchValue(e.target.value);
    }
    //??
    function handleSelectChange(e) {
        setZipValue(e.target.value)
    }

    const handleAddToList = (product) => {
        const stored = JSON.parse(localStorage.getItem("shoppingList")) || [];
        const updated = [...stored, product];
        localStorage.setItem("shoppingList", JSON.stringify(updated));
    
        // Debug output:
        console.log("✅ Product added:", product);
        console.log("📦 localStorage now:", localStorage.getItem("shoppingList"));
    };
    
    

    const navItems = [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Account", path: "/account"},
        { label: "Shopping List", path: "/shopping-list" },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <div className="head">
                <HamburgerMenu navItems={navItems} buttonLabel="☰"/>
                <img src="../images/anan.png" alt="Spark Logo" className="logo"/>
                <form onSubmit={handleSubmit} className="flex justify-center items-center gap-4">
                    <SearchBar items={availItems} value={searchValue} onChange={handleChange}/>
                    <DropDown choices={zipCodes} text={zipText} value={zipValue} onChange={handleSelectChange}/>
                    <Button text="Submit" type="submit" className="bg-base-300 text-lg w-20 h-9"/>
                </form>
            </div>
            <div className="flex-1 flex justify-center items-center p-5"> 
                <div className="body">
                    <Front zip={zip} search={search} onAdd={handleAddToList} />
                </div>
            </div>
        </div>
    );
}

export default Header;


