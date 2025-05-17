import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container } from "@tsparticles/engine"; // Importação explícita do tipo Container
import { loadFireflyPreset } from "@tsparticles/preset-firefly";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  // Inicializa o tsParticles com o preset firefly
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFireflyPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Partículas carregadas:", container);
  };

  // Configurações do preset firefly
  const options = {
    preset: "firefly",
    background: {
      color: {
        value: "transparent", // Fundo transparente para combinar com a imagem de fundo
      },
    },
    particles: {
      number: {
        value: 50, // Ajuste a quantidade de partículas
      },
      size: {
        value: { min: 1, max: 3 }, // Tamanho das partículas
      },
      move: {
        speed: 2, // Velocidade dos vaga-lumes
      },
    },
  };

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      className="absolute inset-0 z-0" // Posiciona as partículas no fundo
    />
  );
};

export default ParticlesBackground;
