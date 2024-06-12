import React from "react";
import { Button } from "react-bootstrap";
import "./Weel.css";

class Weel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinAngleStart: Math.random() * 10 + 10,
      spinTimeTotal: Math.random() * 3 + 4 * 1000,
      startAngle: 0,
      spinTime: 0,
      arc: Math.PI / (this.options.length / 2),
      text: "",
    };
    this.spinTimer = null;
    this.baseSize = 200;
    this.handleOnClick = this.handleOnClick.bind(this);
    this.spin = this.spin.bind(this);
    this.rotate = this.rotate.bind(this);
  }

  options = [
    { number: "0", color: "green" },
    { number: "28", color: "black" },
    { number: "9", color: "red" },
    { number: "26", color: "black" },
    { number: "30", color: "red" },
    { number: "11", color: "black" },
    { number: "7", color: "red" },
    { number: "20", color: "black" },
    { number: "32", color: "red" },
    { number: "17", color: "black" },
    { number: "5", color: "red" },
    { number: "22", color: "black" },
    { number: "34", color: "red" },
    { number: "15", color: "black" },
    { number: "3", color: "red" },
    { number: "24", color: "black" },
    { number: "36", color: "red" },
    { number: "13", color: "black" },
    { number: "1", color: "red" },
    { number: "00", color: "green" },
    { number: "27", color: "red" },
    { number: "10", color: "black" },
    { number: "25", color: "red" },
    { number: "29", color: "black" },
    { number: "12", color: "red" },
    { number: "8", color: "black" },
    { number: "19", color: "red" },
    { number: "31", color: "black" },
    { number: "18", color: "red" },
    { number: "6", color: "black" },
    { number: "21", color: "red" },
    { number: "33", color: "black" },
    { number: "16", color: "red" },
    { number: "4", color: "black" },
    { number: "23", color: "red" },
    { number: "35", color: "black" },
    { number: "14", color: "red" },
    { number: "2", color: "black" },
  ];

  componentDidMount() {
    this.drawRouletteWheel();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.startAngle !== this.state.startAngle) {
      this.drawRouletteWheel();
    }
  }

  componentWillUnmount() {
    this.stopRotateWheel();
  }

  drawRouletteWheel() {
    const baseSize = this.baseSize;
    let { startAngle, arc } = this.state;
    let ctx;
    const canvas = this.refs.canvas;
    if (canvas.getContext) {
      const outsideRadius = baseSize - 25;
      const textRadius = baseSize - 45;
      const insideRadius = baseSize - 85;
      ctx = canvas.getContext("2d");

      ctx.font = "14px Helvetica, Arial";
      for (let i = 0; i < this.options.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = this.options[i].color;
        ctx.beginPath();
        ctx.arc(baseSize, baseSize, outsideRadius, angle, angle + arc, false);
        ctx.arc(baseSize, baseSize, insideRadius, angle + arc, angle, true);
        ctx.fill();
        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(
          baseSize + Math.cos(angle + arc / 2) * textRadius,
          baseSize + Math.sin(angle + arc / 2) * textRadius
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const text = this.options[i].number;
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }
      // Arrow
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(baseSize + 10, baseSize - (outsideRadius + 20));
      ctx.lineTo(baseSize + 0, baseSize - (outsideRadius - 5));
      ctx.lineTo(baseSize - 10, baseSize - (outsideRadius + 20));
      ctx.fill();
      ctx.stroke();
    }
  }

  spin() {
    this.spinTimer = null;
    this.setState({ spinTime: 0 }, () => this.rotate());
  }

  rotate() {
    const { spinAngleStart, spinTime, startAngle, spinTimeTotal } = this.state;
    if (spinTime > spinTimeTotal) {
      clearTimeout(this.spinTimer);
      this.stopRotateWheel();
    } else {
      const spinAngle =
        spinAngleStart -
        this.easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
      this.setState(
        {
          startAngle: startAngle + (spinAngle * Math.PI) / 180,
          spinTime: spinTime + 10,
        },
        () => {
          this.spinTimer = setTimeout(this.rotate, 30);
        }
      );
    }
  }

  stopRotateWheel() {
    let { startAngle, arc } = this.state;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcd = (arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    ctx.save();
    const text = this.options[index].number;
    this.setState({ text }, () => {
      this.props.updateNum(this.state.text);
    });
    ctx.restore();
  }

  easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }

  handleOnClick() {
    this.spin();
    this.props.isSpinning(true);
  }

  renderNumber() {
    return (
      <h1 className="blinky-number display-4 pt-1 m-0">{this.state.text}</h1>
    );
  }

  renderBtnText() {
    if (this.state.text !== "") {
      return <div>{this.renderNumber()}</div>;
    } else {
      return (
        <h6 className="blink text-uppercase m-0">
          Put your bets and spin the wheel!
        </h6>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="roulette-container align-self-start">
          <canvas
            ref="canvas"
            width={this.baseSize * 2}
            height={this.baseSize * 2}
            className="roulette-canvas"
          ></canvas>
          {this.props.arr.length !== 0 ? (
            <Button
              onClick={this.handleOnClick}
              className="m-2 spin-button"
              size="lg"
              block
              variant="danger"
            >
              <h5 className="blink text-uppercase m-0">Spin the wheel!</h5>
            </Button>
          ) : (
            <Button
              className="m-2 spin-button text-small"
              size="lg"
              block
              variant="dark"
            >
              {this.renderBtnText()}
            </Button>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Weel;
