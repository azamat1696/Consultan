import { useToast } from "@heroui/react";

export function useCustomToast() {
    const { toast } = useToast();

    const showSuccess = (message: string) => {
        toast({
            title: "Başarılı",
            description: message,
            color: "success"
        });
    };

    const showError = (message: string) => {
        toast({
            title: "Hata",
            description: message,
            color: "danger"
        });
    };

    return { showSuccess, showError };
} 