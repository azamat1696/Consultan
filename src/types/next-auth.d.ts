import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: number;
        email: string;
        role: "admin" | "client" | "consultant";
    }

    interface Session {
        user: {
            id: number;
            email: string;
            role: "admin" | "client" | "consultant";
        };
    }

    interface JWT {
        role: "admin" | "client" | "consultant";
    }
}
