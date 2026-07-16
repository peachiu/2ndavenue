import Link from "next/link";

export default function TermosPage() {
    return (
        <div className="min-h-screen max-w-3xl mx-auto px-4 md:px-8 py-20">
            <Link href="/" className="text-sm font-bold text-periwinkle hover:opacity-80 transition-opacity mb-8 inline-block">
                ← Voltar ao início
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-off-white mb-8">
                Termos de Utilização
            </h1>
            <div className="prose prose-invert max-w-none space-y-6 text-slate-light leading-relaxed">
                <p className="text-lg">
                    Ao utilizares a SecondAvenue, concordas com os seguintes termos e condições.
                </p>

                <h2 className="text-xl font-bold text-off-white mt-8">1. Conta de Utilizador</h2>
                <p>
                    És responsável por manter a confidencialidade da tua conta e palavra-passe. 
                    Todas as atividades na tua conta são da tua responsabilidade.
                </p>

                <h2 className="text-xl font-bold text-off-white mt-8">2. Publicação de Anúncios</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Os anúncios devem ser verdadeiros e precisos</li>
                    <li>Não é permitido publicar conteúdo ilegal ou ofensivo</li>
                    <li>Os preços devem ser apresentados em Euros (EUR)</li>
                </ul>

                <h2 className="text-xl font-bold text-off-white mt-8">3. Transações</h2>
                <p>
                    A SecondAvenue é uma plataforma de conexão entre compradores e vendedores. 
                    As transações são da responsabilidade das partes envolvidas. Não processamos 
                    pagamentos reais — este site é um projeto demonstrativo.
                </p>

                <h2 className="text-xl font-bold text-off-white mt-8">4. Conduta</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Respeita os outros utilizadores</li>
                    <li>Não utilizes a plataforma para atividades fraudulentas</li>
                    <li>Cumpre as leis e regulamentos aplicáveis</li>
                </ul>

                <h2 className="text-xl font-bold text-off-white mt-8">5. Limitação de Responsabilidade</h2>
                <p>
                    A SecondAvenue não se responsabiliza por transações entre utilizadores. 
                    A plataforma é fornecida &quot;tal como está&quot; para fins educacionais e demonstrativos.
                </p>

                <p className="text-sm text-slate-lighter mt-12">
                    Última atualização: julho de 2026. Este site foi desenvolvido como projeto PAP 
                    (Prova de Aptidão Profissional). Os termos aqui descritos são simulados para 
                    fins demonstrativos.
                </p>
            </div>
        </div>
    );
}
