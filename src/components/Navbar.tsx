import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { navIcons, navLinks } from "#constants/index";

const Navbar = () => {
    const [currentTime, setCurrentTime] = useState(
        dayjs().format("ddd MMM D h:mm:ss A")
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs().format("ddd MMM D h:mm:ss A"));
        }, 1000); // update every second

        return () => clearInterval(interval); // cleanup
    }, []);

    return (
        <nav>
            <div>
                <img src="/images/logo.svg" alt="logo" />
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
                            <img src={img} className="font-bold" alt={`icon-${id}`} />
                        </li>
                    ))}
                </ul>

                <time>{currentTime}</time>
            </div>
        </nav>
    );
};

export default Navbar;
