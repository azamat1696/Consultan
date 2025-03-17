import type { Metadata } from "next";
import { getConsultant } from "./actions";

export async function generateMetadata({params}:{params: {slug: string}}): Promise<Metadata> {
    const {slug} = await params
    const data = await getConsultant(slug as string)
    // data.workspaces is already an array of objects
    const workspaceNames = data.workspaces[0]?.map((workspace: any) => workspace.name).join(", ")
    return {
        title: data.name +" "+ data.surname + " | Dancomy",
        description: data.title,
        keywords: workspaceNames,
        applicationName: "Dancomy",
        twitter: {
            card: "summary_large_image",
            site: "@Dancomy",
        }
    }
}
export default function ConsultantProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div>{children}</div>
}