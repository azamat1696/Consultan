export interface User {
    name: string;
    surname: string;
    gender: string;
    title: string;
    phone: string;
    profile_image?: string;
}

export interface Education {
    education_id: number;
    university_name: string | null;
    educational_degree: string | null;
    department: string | null;
    start_date: Date | null;
    end_date: Date | null;
    status: boolean;
    consultant_id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Certificate {
    certificate_id: number;
    certificate_name: string | null;
    issuing_organization: string | null;
    given_date: Date | null;
    status: boolean;
    consultant_id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Expertise {
    expertise_id: number;
    name: string | null;
}

export interface Workspace {
    workspace_id: number;
    name: string | null;
}

export interface ConsultantExpertise {
    id: number;
    expertise_id: number;
    consultant_id: number;
    workspaces: Workspace[];
    expertise: Expertise;
} 