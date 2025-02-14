import Head from "next/head";
import { useRouter } from "next/router";

export default function Header({ title, description }) {
    const router = useRouter();
    
    // ✅ กำหนดค่า Default SEO
    const defaultTitle = "The New You Academy";
    const fullTitle = title ? `${defaultTitle} - ${title}` : defaultTitle;
    const metaDescription = description || "เรียนรู้และพัฒนาตัวเองกับ The New You Academy";

    return (
        <Head>
            {/* ✅ Dynamic Title */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />

            {/* ✅ Favicon & Theme */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />

            {/* ✅ Open Graph / Facebook */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://www.thenewyouacademy.com${router.pathname}`} />
            <meta property="og:image" content="/default-og-image.jpg" />

            {/* ✅ Twitter Meta */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content="/default-og-image.jpg" />

            {/* ✅ Google Site Verification */}
            <meta name="google-site-verification" content="google-site-verification=google-site-verification=google-site-verification" />

            {/* ✅ Google Analytics */}
            
        </Head>
    );
}
