import { createContext } from "react";
import { IRoomContextValue } from "./type";
import { $roomClientStore } from "../room2/store";

export const RoomContext = createContext<IRoomContextValue>({
  roomStore: $roomClientStore.getState()
})