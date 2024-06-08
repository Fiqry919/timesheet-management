import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Settings - ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: "",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            {children}
        </section>
    );
}