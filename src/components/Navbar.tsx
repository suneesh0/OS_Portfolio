import dayjs from "dayjs"
import {navIcons, navLinks} from "#constants/index"

const Navbar = () => {
    return (
        <nav>
            <div>
                <img src="/images/logo.svg" alt="logo"/>
                <p className="font-bold">My Portfolio</p>

                <ul>
                    {navLinks.map(({ id, name }) => (
                    <li key={id}>
                        <p>{name}</p>
                    </li>
                ))}
                </ul>
            </div>

            <div>
                <ul>
                    {navIcons.map(({ id, img }) => (
                        <li key={id}>
                            <img src={img} className="font-bold" alt={`icon-${id}`}/>
                        </li>
                    ))}
                </ul>
                <time>{dayjs().format("ddd MMM D h:mm A")}</time>
            </div>
        </nav>
    )
}
export default Navbar
