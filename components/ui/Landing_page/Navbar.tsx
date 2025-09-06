

type Navbar={
    name:string,
    path:string

}

export default function Navbar({name,path}:Navbar)
{
    
    return <div>
        <a href={path} > {name}</a>
    </div>
}