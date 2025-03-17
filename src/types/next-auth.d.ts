import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: number;
        name: string;
        email: string;
        surname: string;
        phone: string | null;
        role: "admin" | "client" | "consultant";
    }

    interface Session {
        user: User;
    }

    interface JWT {
        role: "admin" | "client" | "consultant";
    }
}
