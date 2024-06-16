import Header from "../../components/header/header";
import Games from "../../components/games";
import Intro from "../../components/intro/intro";
import AboutHero from "../../components/about/about";
import Footer from "../../components/footer/footer";
import RandomWords from "../../components/contract/RandomWords";

export default function Home() {
  return (
    <>
      <Header />
      <Intro />
      <Games />
      <AboutHero />
      <Footer />
      <RandomWords />
    </>
  );
}
