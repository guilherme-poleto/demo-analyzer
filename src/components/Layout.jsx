import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import "./Main.css";

export const Layout = () => {
    return (
        <div className="layout">
            <Sidebar></Sidebar>
            <div className="content">
                <div className="header"></div>
                <main>
                    {}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
