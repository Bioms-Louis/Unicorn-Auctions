import Link from "next/link";

export default async function BrokersPage() {

    return (
        <section>
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28">
                <div className="flex flex-col justify-end border-l border-hairline pl-8">
                    <dl className="space-y-6">
                        <div>
                            <dt className="font-bold text-2xl">Our Brokers</dt>
                            <dd className="text-ink/80">
                                We have a team of experienced brokers to help you navigate the auction process.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    );
}
