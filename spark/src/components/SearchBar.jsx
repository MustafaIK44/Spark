{/* this is for testing purposes */}
const avail_items = ["Eggs", "Bread", "Milk", "Cereal", "Chicken", "Beef", "Apples", "Bananas", "Rice", "Spam", "Paper towels", "Toilet paper"];

function AvailableItems({listID, list}) {
    return (
        <datalist id={listID}>
            {avail_items.map(
                (item, index) => (<option value={item} key={index}> </option>))
            }
        </datalist>
    );
}

{/* */}
export default function SearchBar() {   
    return (
        <label className="input bg-base-300">
        <svg className="h-[2em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
        <input className="text-lg" type="search" required placeholder="Search for an item" list="available"/>
        <AvailableItems listID="available" list={avail_items} />
        {/*data list should fetch data from the database when it's done*/}
        </label>
    );
}