import { Link } from "react-router-dom";

const NavLinks = () => {
    
    const navLinkClass = "font-poppins text-[14.5px] font-[500] opacity-[0.8] text-gray-800";

    return (
        <div className="flex flex-1 gap-[8%] justify-center">
            <Link to="/"><span className={navLinkClass}>Home</span></Link>
            <Link to="/OrderMenu"><span className={navLinkClass}>Menu</span></Link>
            <Link to="/"><span className={navLinkClass}>About</span></Link>
            <Link to="/"><span className={navLinkClass}>Testimonials</span></Link>
            {/* <Link to="/Cart" className={navLinkClass}>Dashboard</Link> */}
        </div>
    )
}

export default NavLinks;