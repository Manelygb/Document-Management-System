import { NavigateFunction, Location } from "react-router";

/* this is an object that serves as a cuistom navigation utility */
export const history: {
    navigate : NavigateFunction | null;
    location : Location | null;
} = { /*  here we declare with default values */
    navigate : null,
    location : null
}