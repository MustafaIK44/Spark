import React from "react";

/**
 * Create a button that can be used for different onClick events.
 * It will mainly be used to submit info from the search form, or to add an item to a shopping list.
 * @param text, which will be what text the button displays (dependent on what it's used for)
 * @param onClick, what specific onClick event happens
 * @type depends on what type it should be. Button by default, but could be submit type
 * @className is anything to add on top of the daisyui button class name (usually for styling)
 * @returns the rendered button
 */
export default function Button({ text, onClick, type = "button", className = "" }) {
    return (
        <button type={type} onClick={onClick} className={`btn ${className}`} >
            {text}
        </button>
    );
}
