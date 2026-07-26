import Logo from "../../assets/images/logo.png";

const MainLogo = () => {

    return (
        <div className="flex mr-[26%]">
            <div className="flex justify-center items-center">
                <img src={Logo} alt="logo" className="w-[144px]"/>
            </div>
        </div>
    )
}

export default MainLogo;