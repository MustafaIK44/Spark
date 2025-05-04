/**
 * Helper function. Is called by DropDown to fill in the drop down choices in the menu. 
 * @return the choices in the drop down menu
 */
function DropDownChoices ({ choices }) {
    return (
        <>
            {choices.map((choice, index) => (
                <option key={index}>{choice}</option>
            ))}
        </>
    );
}

/**
 * DropDown functionality. Generates a drop down menu that users can choose from. Calls the helper function DropDownChoices.
 * Zipcodes grabbed from this website: https://www.ciclt.net/sn/clt/capitolimpact/gw_ziplist.aspx?FIPS=51059
 *      zipCodes = ["20151", "20153", "22031", "22032", "22033", "22034", "22035", "22036"];
 * 
 * Originally generated with AI using the prompt: "How can I create a dropdown menu using DaisyUI?".
 * Has been modified heavily to use a helper function (DropDownChoices) and to account for scalability and maintainability.
 * 
 * @return a drop down menu if there are choices passed into the function, a "No options available" tab if not
 */
function DropDown({value, onChange, choices, text="Select an Option"}) {
    if (!choices || choices.length === 0) {
        return (
            <div>
                <select className="select" disabled={true}>
                <option> No options available. Please try again later.</option>
                </select>
            </div>
        );
    }

    return (
        <div>
            <select value={value} onChange={onChange} className="bg-base-300 select text-lg w-30 h-9"> 
                <option>{text}</option>
                <DropDownChoices choices={choices}/>
            </select>
        </div>
    );
}
export default DropDown;