import { getReviews } from "@/services/SocialServices.ts";
import { IReview } from "@/types";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export const Testimonials = async () => {
  const { reviews } = await getReviews();

  if (!reviews?.length) return null;

  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? "text-yellow-400" : "text-white/20"}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <section id="reviews" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/8 -translate-y-1/2 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute top-1/2 right-1/8 -translate-y-1/2 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 text-center mb-12 px-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-amber-400 to-orange-400">
          What Our Joiners Say
        </h2>
        <p className="text-slate-400 mt-2 text-sm">Real reviews from real participants</p>
      </div>

      <Marquee pauseOnHover speed={40} gradient={false} className="py-4">
        {reviews.map((review: IReview) => (
          <div
            key={review.id}
            className="mx-5 w-72 md:w-86 shrink-0 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl hover:bg-white/10 hover:border-yellow-500/30 hover:shadow-yellow-500/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative shrink-0">
                <div className="relative w-11 h-11 shrink-0">
                  <Image
                    src={review.user.picture || "https://cdn-icons-png.flaticon.com/512/9385/9385289.png"}
                    alt={review.user.fullName}
                    fill
                    sizes="44px"
                    className="rounded-full object-cover ring-2 ring-yellow-500/30 group-hover:ring-yellow-500/60 transition-all"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-900" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-black text-sm truncate">
                  {review.user.fullName}
                </p>
                <Stars rating={review.rating} />
              </div>
              <div className="ml-auto shrink-0 w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                <span className="text-yellow-400 font-bold text-sm">{review.rating}</span>
              </div>
            </div>

            {review.comment && (
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 italic">
                &ldquo;{review.comment}&rdquo;
              </p>
            )}

            <div className="mt-4 h-px bg-linear-to-r from-transparent via-yellow-500/30 to-transparent" />
          </div>
        ))}
      </Marquee>
    </section>
  );
};