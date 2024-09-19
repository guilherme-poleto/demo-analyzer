import { FaGithub, FaSteam, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
    const navigate = useNavigate();

    const handleIconClick = (page) => {
        switch (page) {
            case "main":
                navigate("/");
                break;
            case "github":
                window.open("https://github.com/guilherme-poleto", "_blank");
                break;
            case "twitter":
                window.open("https://x.com/gui_poleto", "_blank");
                break;
            case "stats":
                navigate("/stats");
                break;
            case "steam":
                window.open(
                    "https://steamcommunity.com/id/youngui_blessed/",
                    "_blank"
                );
                break;
        }
    };

    return (
        <aside className="side-bar">
            <div>
                <div className="logo-container">
                    <img
                        src="/src/assets/images/full-logo.png"
                        className="logo"
                        onClick={() => {
                            handleIconClick("main");
                        }}
                    ></img>
                </div>
                <nav>
                    <ul className="side-bar-list">
                        <li
                            className="side-bar-list-item"
                            onClick={() => {
                                handleIconClick("main");
                            }}
                        >
                            Matches
                        </li>
                        <li
                            className="side-bar-list-item"
                            onClick={() => {
                                handleIconClick("stats");
                            }}
                        >
                            Statistics
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="side-bar-footer">
                <FaGithub
                    className="side-bar-icon"
                    onClick={() => handleIconClick("github")}
                ></FaGithub>
                <FaTwitter
                    className="side-bar-icon"
                    onClick={() => handleIconClick("twitter")}
                ></FaTwitter>
                <FaSteam
                    className="side-bar-icon"
                    onClick={() => handleIconClick("steam")}
                ></FaSteam>
            </div>
        </aside>
    );
};
