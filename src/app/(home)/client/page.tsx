import GeneralInfo from "./components/GeneralInfo";
import Orders from "./components/Orders";
import PasswordReset from "./components/PasswordReset";

export default function Page() {
    return (
        <div className="container mx-auto px-4 py-8 h-screen">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Genel Bilgiler - 30% width */}
                <div className="lg:w-[30%]">
                    <GeneralInfo />
                </div>

                {/* Siparişlerim ve Şifre Yenileme - 70% width */}
                <div className="lg:w-[70%] space-y-8">
                    <Orders />
                    <PasswordReset />
                </div>
            </div>
        </div>
    );
}
