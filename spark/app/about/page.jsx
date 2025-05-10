"use client";
// app/about/page.jsx
import HamburgerMenu from "@/components/HamburgerMenu";

export default function AboutPage() {
    const navItems = [
        { label: "Home", path: "/" },
        { label: "Account", path: "/account"},
        { label: "Shopping List", path: "/shopping-list" },
    ];

    return (
        <div className="w-full flex flex-col items-center justify-center sm:p-5">
            <div className= "w-full max-w-7xl p-6 bg-base-300 rounded-xl shadow-md flex flex-row items-center justify-center gap-6"> 
                <div className="flex-none"> <HamburgerMenu navItems={navItems} buttonLabel="☰" /> </div>
                <h1 className="text-5xl font-bold">All About </h1>
                <img src="../images/anan.png" alt="Spark Logo" className="logo"/>
            </div>
            <div className="w-full items-center m-5 max-w-6xl p-5 gap-4 bg-base-200 shadow-md rounded-xl">
                <p className="p-3 text-xl"> <b>Tired of buying groceries at crazy prices? So are we. </b> That's why we decided to make Spark, so you can find the cheapest spot to shop -- by item. </p>
                <p className="p-3 text-lg"> We make searching easy! All you have to do is type in your desired item in the search bar, choose your zipcode, and press submit! 
                    Right now, we support searching all over Fairfax City, VA. </p>
                <p className="p-3 text-lg"> Spark will search through all your local stores and compile a list of the cheapest matches. 
                    From there, you can decide which item you want and add it to your shopping list. </p>
                <p className="p-3 text-lg"> When you're done searching, you can head over to the Shopping List tab to review it. 
                    Your list is organized by store, so you can get in and get out while getting the best possible price. </p>
                <br />
                <p className="p-6 text-m"> Spark was made by Sriram Basavaraju, Ariel Clemmons, Biswesh Dhungana, Caden Green, Mustafa Koc, Alexander Taylor, and Daphne Ziegenfelder. 
                    Made for CS321 Capstone Project at George Mason University.</p>
            </div>
        </div>
    );
}
