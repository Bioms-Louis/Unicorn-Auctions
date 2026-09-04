import Link from "next/link";

export default async function PartnersPage() {

    return (
        <section>
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28">
                <div className="flex flex-col justify-end border-l border-hairline pl-8">
                    <dl className="space-y-6">
                        <div>
                            <dt className="font-bold text-2xl">Our Partners</dt>
                                <dd className="text-ink/80">
                                    We work with a diverse range of partners to bring you the best auction experience.
                                </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    );
}
