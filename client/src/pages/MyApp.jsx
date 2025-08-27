import { LoginPage } from "./LoginPage";
import { Theme } from "@radix-ui/themes"

export default function MyApp() {
    return (
        <>
        <LoginPage />
        <Theme>
                <Dashboard />
        </Theme>
        </>
    )
}