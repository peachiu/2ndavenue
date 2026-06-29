import { Camera, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";

export default function CreateListingPage() {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen pb-20 pt-8 bg-charcoal">

            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="mb-12">
                    <Link href="/dashboard" className="text-sm font-black text-slate-lighter lowercase hover:text-periwinkle flex items-center gap-1 mb-4">
                        {t("back_to_studio")}
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black lowercase tracking-tighter">
                        {t("list_an_item")}
                    </h1>
                </div>

                <div className="space-y-12 pb-20">
                    {/* Step 1: Photos */}
                    <section className="space-y-6">
                        <div className="flex items-end justify-between">
                            <h2 className="text-2xl font-black lowercase tracking-tight">1. {t("vibe_check_photos")}</h2>
                            <span className="text-sm font-bold text-slate-lighter">{t("up_to_photos")}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="aspect-square clay-card bg-card-bg border-dashed border-2 flex flex-col items-center justify-center gap-3 text-slate-lighter hover:text-periwinkle transition-all group">
                                <div className="h-12 w-12 rounded-full bg-hover-bg flex items-center justify-center group-hover:bg-periwinkle/10 transition-colors">
                                    <Camera className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold lowercase">{t("upload")}</span>
                            </button>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square clay-card bg-hover-bg flex items-center justify-center relative">
                                    <button className="absolute -top-2 -right-2 p-1.5 bg-card-bg rounded-full shadow-md text-slate-lighter hover:text-rose-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Step 2: Details */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black lowercase tracking-tight">2. {t("the_specifics")}</h2>
                        <div className="clay-card p-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text font-bold text-off-white ml-1 lowercase">{t("title")}</label>
                                <input
                                    type="text"
                                    placeholder="e.g. vintage 90s knit sweater"
                                    className="w-full bg-hover-bg px-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text font-bold text-off-white ml-1 lowercase">{t("price")}</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-lighter">€</span>
                                        <input
                                            type="number"
                                            placeholder="00.00"
                                            className="w-full bg-hover-bg pl-12 pr-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text font-bold text-off-white ml-1 lowercase">{t("category")}</label>
                                    <select className="w-full bg-hover-bg px-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all font-bold text-off-white shadow-inner text-lg appearance-none">
                                        <option>{t("select_category")}</option>
                                        <option>{t("cat.apparel")}</option>
                                        <option>{t("cat.accessories")}</option>
                                        <option>{t("cat.home")}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text font-bold text-off-white ml-1 lowercase">{t("description")}</label>
                                <textarea
                                    rows={5}
                                    placeholder={t("tell_us_about")}
                                    className="w-full bg-hover-bg px-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Step 3: Publish */}
                    <div className="flex items-center justify-between pt-8">
                        <button className="px-8 py-5 rounded-full font-bold text-slate-light hover:bg-hover-bg transition-colors">
                            {t("save_draft")}
                        </button>
                        <button className="clay-btn px-12 py-5 text-xl flex items-center gap-3">
                            {t("list_item")}
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
