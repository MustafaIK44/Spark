// app/account/page.jsx
import HamburgerMenu from "@/components/HamburgerMenu";

export default function AccountPage() {
    const navItems = [
        { label: "Home", path: "/" },
        { label: "About", path: "/about"},
        { label: "Shopping List", path: "/shopping-list" },
    ];

    return (
        <div className="p-4">
            <HamburgerMenu navItems={navItems} buttonLabel="☰" />
                <p>Login stuff here.</p>
        </div>
    );
}
