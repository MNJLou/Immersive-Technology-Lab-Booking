import {UserIcon} from "@heroicons/react/24/outline";
import LogoutButton from "@/components/LogoutButton";
import { headerProps } from "../../libs/interfaces";
import React from "react";

export default function Header ({studentNumber, setLoadingPage}: headerProps) {
    return (
        <div className="user w-full flex justify-end pe-2 lg:pe-0">
            <div className="student-number flex place-items-center">
                <UserIcon className="h-6 w-6" />
                <span className="px-4">{studentNumber}</span>
            </div>
            <LogoutButton setLoadingPage={setLoadingPage}/>
        </div>
    )
}