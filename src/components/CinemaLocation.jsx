import React from 'react';

const CinemaLocation = ({ onBack }) => {
    const photos = {
        outside: "https://th.bing.com/th/id/R.d67eb16712c5c432126a7ff9066d3fec?rik=OkudjEaUZM6tgw&pid=ImgRaw&r=0",
        inside: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000",
        lounge: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=1000"
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button
                onClick={onBack}
                className="mb-8 text-zinc-400 hover:text-yellow-500 transition-colors flex items-center gap-2 group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para a Home
            </button>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <h2 className="text-5xl font-black tracking-tighter mb-6">NOSSA <span className="text-yellow-500">UNIDADE</span></h2>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                        Localizado no coração do bairro Hollywood, o <strong>CinemarkPolly</strong> é mais do que um cinema, é uma experiência sensorial.
                        Nossa unidade conta com arquitetura inspirada nos anos dourados do cinema mundial, mesclada com tecnologia de ponta.
                    </p>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                            <span className="text-2xl">🍿</span>
                            <div>
                                <h4 className="font-bold text-white">Pipoca Gourmet</h4>
                                <p className="text-zinc-500 text-sm">Receitas exclusivas com milho importado.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                            <span className="text-2xl">🔊</span>
                            <div>
                                <h4 className="font-bold text-white">Som Dolby Atmos</h4>
                                <p className="text-zinc-500 text-sm">Imersão 360º em todas as nossas salas.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <img src={photos.outside} alt="Fachada" className="rounded-3xl shadow-2xl border border-zinc-800" />
                    <div className="absolute -bottom-6 -right-6 bg-yellow-500 text-black p-6 rounded-2xl font-black rotate-3">
                        Fachada principal
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h3 className="text-2xl font-bold border-l-4 border-yellow-500 pl-4">POR DENTRO DAS SALAS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <img src={photos.inside} alt="Sala interna" className="rounded-2xl w-full h-64 object-cover border border-zinc-800" />
                        <p className="text-zinc-400 text-sm text-center italic">Poltronas reclináveis em couro legítimo e amplo espaço entre fileiras.</p>
                    </div>
                    <div className="space-y-4">
                        <img src={photos.lounge} alt="Lounge" className="rounded-2xl w-full h-64 object-cover border border-zinc-800" />
                        <p className="text-zinc-400 text-sm text-center italic">Nosso Lounge VIP para espera e convivência pré-filme.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CinemaLocation;