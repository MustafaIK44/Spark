/**
 * DropDown functionality. 
 * Zipcodes grabbed from this website: https://www.ciclt.net/sn/clt/capitolimpact/gw_ziplist.aspx?FIPS=51059
 */
export default function DropDown() {
    return (
        <div className="dropdown">
            <label tabIndex="0" className="btn m-1">Zip Codes</label>
            <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>20151</a></li>
                <li><a>20153</a></li>
                <li><a>22031</a></li>
                <li><a>22032</a></li>
                <li><a>22033</a></li>
                <li><a>22034</a></li>
                <li><a>22035</a></li>
                <li><a>22036</a></li>
            </ul>
        </div>
    );
}