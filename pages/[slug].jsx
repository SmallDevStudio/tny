import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getServerSideProps(context) {
    const { slug } = context.params;
    const pageRef = doc(db, "pages", slug);
    const pageSnap = await getDoc(pageRef);

    if (!pageSnap.exists()) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            pageData: pageSnap.data(),
        },
    };
}

export default function DynamicPage({ pageData }) {
    console.log(pageData);
    return (
        <div>
            <h1>{pageData?.title}</h1>
            <p>{pageData?.content}</p>
        </div>
    );
}
