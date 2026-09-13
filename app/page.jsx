import Astro from "./astro";

export const metadata = {
  title: "Predictor",
  description: "The most accurate astrology tool in the world. Get your personalized astrology report and discover your future today.",
};

const page = () => {
  return (
      <Astro />
  );
};

export default page;