import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { DataConnection } from "peerjs";

interface PeerContextType {
    connection: DataConnection | null;
    setConnection: Dispatch<SetStateAction<DataConnection | null>>;
}

export const PeerContext = createContext<PeerContextType>({
    connection: null,
    setConnection: () => {},
});

export const usePeer = () => useContext(PeerContext);
