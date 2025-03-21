import logo from "../assets/nirusanHariharanLogo.webp"
const Navbar = () => {
    return(
        <nav className="flex items-center justify-between py-6">
            <div className="flex flex-shrink-0 items-center">
                <a href="/" aria-label="Home">
                    <img src={logo} alt="Logo" className="mx-2 w-[50px] h-[33px]" />
                </a>
            </div>
        </nav>
    )
}

export default Navbar