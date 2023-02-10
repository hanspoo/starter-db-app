import { IOrdenCompra } from "@flash-ws/api-interfaces";
import { createContext } from "react";

export const OrdenContext = createContext<IOrdenCompra | undefined>(undefined);