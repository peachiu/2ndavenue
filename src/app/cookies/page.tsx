import Link from "next/link";

export default function CookiesPage() {
    return (
        <div className="min-h-screen max-w-3xl mx-auto px-4 md:px-8 py-20">
            <Link href="/" className="text-sm font-bold text-periwinkle hover:opacity-80 transition-opacity mb-8 inline-block">
                ← Voltar ao início
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-off-white mb-8">
                Política de Cookies
            </h1>
            <div className="prose prose-invert max-w-none space-y-6 text-slate-light leading-relaxed">
                <p className="text-lg">
                    Este site utiliza cookies para melhorar a tua experiência de navegação.
                    Abaixo explicamos o que são cookies e como os utilizamos.
                </p>

                <h2 className="text-xl font-bold text-off-white mt-8">O que são Cookies?</h2>
                <p>
                    Cookies são pequenos ficheiros de texto armazenados no teu dispositivo quando visitas 
                    um site. Eles ajudam o site a funcionar corretamente e a melhorar a tua experiência.
                </p>

                <h2 className="text-xl font-bold text-off-white mt-8">Cookies que Utilizamos</h2>

                <div className="space-y-4 mt-4">
                    <div className="p-4 bg-card-bg rounded-2xl border border-slate-700">
                        <h3 className="font-bold text-off-white">🔧 Necessários</h3>
                        <p className="text-sm mt-1">Essenciais para o funcionamento básico do site. Incluem cookies de sessão e autenticação.</p>
                    </div>
                    <div className="p-4 bg-card-bg rounded-2xl border border-slate-700">
                        <h3 className="font-bold text-off-white">📊 Analíticos</h3>
                        <p className="text-sm mt-1">Ajudam-nos a perceber como os utilizadores interagem com o site, permitindo melhorar a experiência.</p>
                    </div>
                    <div className="p-4 bg-card-bg rounded-2xl border border-slate-700">
                        <h3 className="font-bold text-off-white">📢 Marketing</h3>
                        <p className="text-sm mt-1">Utilizados para mostrar anúncios relevantes e medir a eficácia de campanhas.</p>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-off-white mt-8">Gerir as tuas Preferências</h2>
                <p>
                    Podes gerir as tuas preferências de cookies a qualquer momento clicando no botão 
                    de definições de cookies disponível no site.
                </p>

                <h2 className="text-xl font-bold text-off-white mt-8">Cookies de Terceiros</h2>
                <p>
                    Este site pode utilizar serviços de terceiros (como Google Analytics) que definem 
                    os seus próprios cookies. Não temos controlo sobre esses cookies.
                </p>

                <p className="text-sm text-slate-lighter mt-12">
                    Última atualização: julho de 2026. Este site foi desenvolvido como projeto PAP 
                    (Prova de Aptidão Profissional). As políticas aqui descritas são simuladas para 
                    fins demonstrativos.
                </p>
            </div>
        </div>
    );
}
