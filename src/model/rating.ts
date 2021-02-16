import {Snowflake} from "discord.js";

export interface Rating {
    _id: Snowflake; // <--- user id
    rating: number;
}
