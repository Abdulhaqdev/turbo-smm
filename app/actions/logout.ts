"use server"

import { cookies } from "next/headers";


export default async function logout() {
    const cookieStore = await cookies()
    try {
        cookieStore.delete("refresh_token");
        return { message: "Login successful" };
    } catch {
        throw new Error("Something went wrong");
    }
}