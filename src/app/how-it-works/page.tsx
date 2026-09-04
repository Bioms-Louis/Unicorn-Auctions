import Link from "next/link";

export default async function HowItWorksPage() {

    return (
        <section>
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28">
                <div className="flex flex-col justify-end border-l border-hairline pl-8">
                    <dl className="space-y-6">
                        <div>
                            <dt className="font-bold text-2xl">How It Works</dt>
                            <dd className="text-ink/80">
                                Learn how our auction platform works and how you can participate in exciting auctions.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    );
}
