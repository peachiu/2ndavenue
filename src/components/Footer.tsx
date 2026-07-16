import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-5 border-t border-slate-700 bg-card-bg/50 backdrop-blur-xl pt-16 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Col */}
                    <div className="md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="SecondAvenue"
                                className="h-8 w-8 object-contain rounded-xl"
                            />
                            <span className="text-lg font-black tracking-tight text-off-white lowercase">
                                secondavenue
                            </span>
                        </Link>
                        <p className="text-slate-light font-medium text-sm leading-relaxed">
                            Um mercado para todos. Compra, vende e descobre peças únicas para o teu mundo.
                        </p>
                    </div>

                    {/* Marketplace Links */}
                    <div className="space-y-4">
                        <h4 className="font-black text-off-white">Marketplace</h4>
                        <ul className="space-y-2 text-sm font-bold text-slate-lighter italic">
                            <li><Link href="/feed" className="hover:text-periwinkle transition-colors">Todos os produtos</Link></li>
                            <li><Link href="/create-listing" className="hover:text-periwinkle transition-colors">Vende o teu artigo</Link></li>
                            <li><Link href="/dashboard" className="hover:text-periwinkle transition-colors">As minhas peças</Link></li>
                        </ul>
                    </div>

                    {/* Studio Links */}
                    <div className="space-y-4">
                        <h4 className="font-black text-off-white">Sobre ti</h4>
                        <ul className="space-y-2 text-sm font-bold text-slate-lighter italic">
                            <li><Link href="/dashboard" className="hover:text-periwinkle transition-colors">Painel</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-700">
                    <p className="text-xs font-bold text-slate-lighter">
                        © 2026 secondavenue. Feito com amor para ti.
                    </p>
                    <div className="flex gap-8 text-xs font-bold text-slate-lighter">
                        <Link href="/privacidade" className="hover:text-off-white">Privacidade</Link>
                        <Link href="/termos" className="hover:text-off-white">Termos</Link>
                        <Link href="/cookies" className="hover:text-off-white">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
