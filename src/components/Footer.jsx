import React from 'react';

const Footer = ({ onShowLocation }) => {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-8 px-8 mt-20">
            {/* Grid centralizado */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center">

                {/* Coluna 1: Logo e Endereço (Agora com clique) */}
                <div
                    className="space-y-4 flex flex-col items-center cursor-pointer group"
                    onClick={onShowLocation}
                >
                    <h3 className="text-xl font-black tracking-tighter text-white group-hover:text-yellow-500 transition-colors">
                        CINEMARK<span className="text-yellow-500 italic">POLLY</span>
                    </h3>
                    <div className="text-zinc-400 text-sm leading-relaxed not-italic group-hover:text-zinc-200 transition-colors">
                        <p>📍 Rua das Pipocas Gourmet, 777</p>
                        <p>Bairro Hollywood - São Paulo/SP</p>
                        <span className="block text-[10px] text-yellow-500/50 mt-2 font-bold uppercase tracking-widest animate-pulse">
                            Clique para conhecer o local
                        </span>
                    </div>
                </div>

                {/* Coluna 2: Contato */}
                <div className="space-y-4 flex flex-col items-center">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-yellow-500">Atendimento</h4>
                    <div className="text-zinc-400 text-sm space-y-2">
                        <p className="hover:text-white transition-colors cursor-default">📞 (11) 98765-4321</p>
                        <p className="hover:text-white transition-colors cursor-default">✉️ contato@cinemarkpolly.com</p>
                    </div>
                </div>

                {/* Coluna 3: Redes Sociais */}
                <div className="space-y-4 flex flex-col items-center">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-yellow-500">Siga-nos</h4>
                    <div className="flex gap-4 justify-center">
                        {[
                            { name: "Instagram", src: "/instagram.jpg", href: "#" },
                            { name: "Facebook", src: "/facebook.jpg", href: "#" },
                            { name: "Twitter", src: "/twitter.jpg", href: "#" }
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-yellow-500 transition-all overflow-hidden group/social"
                            >
                                <img
                                    src={social.src}
                                    alt={social.name}
                                    className="w-full h-full object-cover opacity-70 group-hover/social:opacity-100 transition-opacity"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 text-center">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                    © {new Date().getFullYear()} CinemarkPolly - Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

