import { createContext, Dispatch, SetStateAction, useContext } from "react";
import Peer, { DataConnection } from "peerjs";

interface PeerContextType {
    peer: Peer | null;
    setPeer: Dispatch<SetStateAction<Peer | null>>;
    connection: DataConnection | null;
    setConnection: Dispatch<SetStateAction<DataConnection | null>>;
}

export const PeerContext = createContext<PeerContextType>({
    peer: null,
    setPeer: () => {},
    connection: null,
    setConnection: () => {},
});

export const usePeer = () => useContext(PeerContext);
