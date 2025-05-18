import { useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container } from "@tsparticles/engine";
import { loadFireflyPreset } from "@tsparticles/preset-firefly";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const [key, setKey] = useState(Date.now()); // Chave para forçar remontagem

  // Inicializa o tsParticles com o preset firefly
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFireflyPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Recarrega o componente a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      setKey(Date.now()); // Atualiza a chave para remontar o componente
    }, 120000); // 5 minutos = 300.000 ms

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  const particlesLoaded = useCallback(
    async (container?: Container): Promise<void> => {
      console.log("Partículas carregadas:", container);
    },
    []
  );

  // Configurações otimizadas do preset firefly
  const options = {
    preset: "firefly",
    fullScreen: { enable: false }, // Renderiza apenas no contêiner
    fpsLimit: 30, // Limita a 30 FPS para reduzir uso da CPU
    background: {
      color: {
        value: "transparent", // Fundo transparente
      },
    },
    particles: {
      number: {
        value: 20, // Reduzido para 20 partículas (ajuste conforme necessário)
        density: {
          enable: true,
          value_area: 800, // Área de densidade para espalhar partículas
        },
      },
      size: {
        value: { min: 1, max: 3 }, // Tamanho das partículas
      },
      move: {
        speed: 1, // Velocidade reduzida para menos processamento
        // outModes: "out", // Partículas saem da tela
      },
      opacity: {
        value: { min: 0.3, max: 0.7 }, // Opacidade para efeito suave
      },
      interactions: {
        onHover: { enable: false }, // Desativa interações com mouse
        onClick: { enable: false }, // Desativa cliques
      },
    },
    detectRetina: true, // Otimiza para telas de alta resolução
  };

  if (!init) return null;

  return (
    <Particles
      key={key} // Chave dinâmica para forçar remontagem
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      className="absolute inset-0 z-0"
    />
  );
};

export default ParticlesBackground;
