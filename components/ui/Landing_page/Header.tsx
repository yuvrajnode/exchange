import Navbar from "./Navbar"
import Button from "./Button"
export default function Header(){



    return <div className=" flex flex-row  ">
<div className=" flex flex-row-1 w-full h-[100px] justify-between my-20 mx-30">
      <Navbar name="Market" path="/market"></Navbar>
      <Navbar name="Home" path="/market"></Navbar>
      <Navbar name="NFT" path="/#"></Navbar>
      <Navbar name="Learn" path="/#"></Navbar>
      <div className=" flex mx-[0px] w-[1px]"></div>
      <div className=" flex flex-row-1 h-[100px] w-[300px]">
       <button  name="login" className="text-white ">Login</button>
       <Button  name="Signup" ></Button>
      </div>
    </div>
        </div>
}

