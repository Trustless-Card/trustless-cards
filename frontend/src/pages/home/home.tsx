import Header from "../../components/header";
import Games from "../../components/games";
import Intro from "../../components/intro";
import AboutHero from "../../components/about/about";
import Footer from "../../components/footer/footer";

export default function Home() {
  return (
    <>
      <Header />
      <Intro />
      <Games />
      <AboutHero />
      <Footer />
    </>
  );
}
