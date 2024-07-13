import { createContext } from "react";
import { IRoomContextValue } from "./type";
import { $roomStore } from "../room/store";

export const RoomContext = createContext<IRoomContextValue>({
  roomStore: $roomStore.getState()
})