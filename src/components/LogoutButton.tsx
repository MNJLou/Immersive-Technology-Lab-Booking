import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { logoutButtonProps } from "../../libs/interfaces";
export default function LogoutButton({setLoadingPage}: logoutButtonProps) {
    const handleLogout = async () => {
        setLoadingPage(true);
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            setLoadingPage(false);
            window.location.href = '/login';
        }    
    }
    
    return (
        <button className="flex items-center bg-white border-tertiary border text-black px-4" onClick={handleLogout}>
            <span className="pe-2">Logout</span>
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
        </button>
    )
}