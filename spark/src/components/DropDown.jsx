/**
 * Helper function. Is called by DropDown to fill in the drop down choices in the menu. 
 * @return the choices in the drop down menu
 */
function DropDownChoices ({ choices }) {
    return (
        <>
            {choices.map((choice, index) => (
                <li key={index}><a>{choice}</a></li>
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
export default function DropDown({ choices }) {
    if (!choices || choices.length === 0) {
        return (
            <div className="dropdown">
                <label tabIndex="0" className="btn m-1">Zip Codes</label>
                <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-80">
                    <li>No options available at the moment. Please try again later.</li>
                </ul>
            </div>
        );
    }

    return (
        <div className="dropdown">
            <label tabIndex="0" className="btn m-1">Zip Codes</label>
            <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-80">
                <DropDownChoices choices={ choices } />
            </ul>
        </div>
    );
}