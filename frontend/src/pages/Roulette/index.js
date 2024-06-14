import { Wheel } from "react-custom-roulette";

const data = [
  { option: "0", style: { backgroundColor: "green", textColor: "black" } },
  { option: "1", style: { backgroundColor: "white" } },
  { option: "2" },
];

const mustSpin = true

export default function Roulette() {
  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={3}
        data={data}
        backgroundColors={["#3e3e3e", "#df3428"]}
        textColors={["#ffffff"]}
      />
    </>
  );
}
