import Image from "next/image";

export default function Partner() {
    return (
        <section className="bg-white dark:bg-gray-800">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                    <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">Our Partners</h2>
                    {/*<p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>*/}
                </div>
                <div>
                    <Image
                        className="w-full"
                        src="/images/partner.png"
                        alt="partner"
                        width={1500}
                        height={1500}
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
}