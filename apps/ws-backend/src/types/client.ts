import WebSocket from "ws";

export type Client = [WebSocket, string];
export type Clients = Map<string, Client>;
export type Rooms = Map<string, Clients>;