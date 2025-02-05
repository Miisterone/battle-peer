import { useNavigate } from 'react-router-dom';
import {useState} from "react";

export function Connect() {
    const navigate = useNavigate();
    const [id, setId] = useState<string>();
    
    function login(event: React.FormEvent) {
        event.preventDefault();
        console.log("Connect with ID: ",id);
        navigate("/rooms", {state: {id}});
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-700">
            <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold text-gray-900">
                    Battle Peer
                </h2>

                <form onSubmit={login} className="space-y-6">
                    <div>
                        <label htmlFor="idpeer" className="block text-sm font-medium text-gray-700">
                            Id Peer
                        </label>
                        <input
                            id="idpeer"
                            name="idpeer"
                            type="text"
                            required
                            autoComplete="idpeer"
                            className="mt-2 block w-full rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(event) => setId(event.target.value)}
                        />
                    </div>

                    <div>
                        <button type="submit" className="w-full rounded-md bg-indigo-600 p-2 text-white font-semibold shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                            Connect
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
