// app/about/page.jsx
import HamburgerMenu from "@/components/HamburgerMenu";
import About from "@/About";

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
            <About />
        </div>
    );
}
