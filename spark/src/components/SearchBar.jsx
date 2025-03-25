/**
 * Helper function. Turns items from array into a option for the datalist.
 * Each option should have a clear index so it renders properly.
 * Returns the finalized datalist for the autocomplete/suggestions.
 * @param listID is the id for the datalist (will always be available items).
 * @param list is the array that must be parsed into options, and then put into the datalist.
 * @returns the finalized datalist.
 */
function AvailableItems({listID, list}) {
    return (
        <datalist role="listbox" id={listID}>
            {list.map(
                (item, index) => (<option value={item} key={index}> </option>))
            }
        </datalist>
    );
}


/**
 * Allow users to provide a string of input on what item they would like to search.
 * Uses the autocomplete built-in function to present suggestions to the user.
 * If given an array of items (items) that is not empty, it will populate a datalist that will show as suggestions.
 * Otherwise, the field should be disabled and not allow the user to input anything.
 * @param items is an array.
 * @returns the code to render the search bar.
 */
function SearchBar({items, searchValue, handleChange}) {   
    {/* if there is no item list, then database is empty. */}
    if (!items || items.length == 0) {
        return (
            <label className="input bg-base-300 w-[600px]">
            <svg className="h-[2em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
            <input className="text-xl" type="search" required placeholder="No items available" disabled/>
            </label>
        );
    }

    {/* if there are items, then allow user to type in the input field. Also, populate the datalist. */}
    return (
        <label className="input bg-base-300 w-[600px] p-1">
        <svg className="h-[2em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
        <input className="text-xl" type="search" placeholder="Search" list="available"  value={searchValue} onChange={handleChange} required/>
        <AvailableItems listID="available" list={items} />
        </label>
    );
}
export default SearchBar;