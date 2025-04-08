// app/about/page.jsx
import HamburgerMenu from "@/components/HamburgerMenu";

export default function AboutPage() {
    const navItems = [
        { label: "Home", path: "/" },
        { label: "Account", path: "/account"},
        { label: "Shopping List", path: "/shopping-list" },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-end p-4">
                <HamburgerMenu navItems={navItems} buttonLabel="☰" />
            </div>
            <h1 className="text-2xl font-bold mb-2">About</h1>
            <p>Spark is a grocery app for the Northern Virginia Fairfax area. Built for CS321.</p>
        </div>
    );
}
