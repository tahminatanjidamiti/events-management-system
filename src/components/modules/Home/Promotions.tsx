import Link from "next/link";

export default function Promotions() {
    return (
        <section className="promotions py-20 bg-linear-to-b from-gray-700 from-5% via-yellow-700 to-gray-700 text-white text-center">
            {/* dark:bg-gray-950 */}
            <h2 className="text-3xl font-bold mb-4">🎉🎉Special Offers🎉🎉</h2>
            <p className="mb-6">✨Now 20% off, get your 1st event! Limited time offer.✨</p>
            <button className="bg-white border-2 border-yellow-700 text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition">
                <Link href="/events">Claim Offer 🎯</Link>
            </button>
        </section>
    );
};
