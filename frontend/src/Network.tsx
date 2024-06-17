// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { FC } from "react";

import Header from "./components/header/header";
import Intro from "./components/intro/intro";
import AboutHero from "./components/about/about";
import Footer from "./components/footer/footer";
import Games from "./components/games"

import './App.css'

export const Network: FC = () => {

    return (
		<>
		    <Header />
		    <Intro />
		    <AboutHero />
		    <Games />
		    <Footer />
		</>
    );
};
