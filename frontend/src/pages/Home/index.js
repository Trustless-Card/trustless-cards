import React from "react";
import Header from "../../components/header/Header";
import About from "../../components/about/About";
import Intro from "../../components/intro/Intro";
import Games from "../../components/games/Games";
import Footer from "../../components/footer/Footer";
import "../../App.css";

export default function Home() {
  return (
    <>
      <Header />
      <Intro />
      <Games />
      <About />
      <Footer />
    </>
  );
}
