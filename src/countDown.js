import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { keyframes, css } from "styled-components";

const Container = styled.div`
  margin: 120px;
`;

const Wrapper = styled.div`
  width: 350px;
  height: 350px;
  position: relative;
  margin: 0px auto;
`;

const DotCircleWrapper = styled.div`
  position: relative;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  transform: rotate(-90deg);
`;

const DotIn = keyframes`
  from {
    transform: scale(0);
    opacity:0;
  }
  to {
    transform: scale(0.7);
    opacity:0.2;
  }
`;

const DotTick = style => {
  return keyframes`
  from {
    background-color: #ffffff;
    transform: scale(0.7);
    opacity:0.2;
  }
  to {
    background-color: ${style.backgroundColor};
    opacity: ${style.opacity};
    transform: ${style.transform};
  }
`;
};

const Dot = styled.div`
  position: absolute;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0;
  transform: scale(0);
  ${p =>
    p.ticket &&
    css`
      animation: ${DotTick(p.ticket)} 0.3s ease forwards;
    `}
  ${p =>
    p.end &&
    css`
      background: #0cb14b !important;
      animation: none !important;
      transition: all 0.3s ease;
      transform: scale(1);
      opacity: 1;
    `}
`;

const CountDownSecondIn = keyframes`
  from {
    opacity:0;
    transform: scale(0);
  }
  to {
    opacity:1;
    transform: scale(1);
  }
`;

const CountDownSecond = styled.div`
  display: ${p => (p.show ? "block" : "none")};
  font-size: 220px;
  line-height: ${p => p.size}px;
  position: absolute;
  top: 0px;
  left: 0px;
  color: #fff;
  width: 100%;
  text-align: center;
  ${p =>
    p.animate &&
    css`
      opacity: 0;
      transform: scale(0);
      animation: ${CountDownSecondIn} 0.3s ease forwards;
    `}
`;

const EndWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const EndCheckIn = keyframes`
  from {
    stroke-dashoffset: -210px;
  }
  to {
    stroke-dashoffset: 0px;
  }
`;

const EndCheck = styled.path`
  stroke: #ffffff;
  stroke-width: 20px;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 210px;
  stroke-dashoffset: -210px;
  fill: transparent;
  animation: ${EndCheckIn} 0.4s ease forwards;
`;

class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dots: this.getCircleDots(),
      countDown: this.props.countDownSecond,
      end: false
    };
    this.tickInterval = null;
  }

  getCircleDots() {
    const { size, dotsize, dotcount } = this.props;
    const stack = [],
      radius = size / 2;
    let index = 0,
      xlast = -1,
      ylast = -1;
    let x, y;
    for (; index <= dotcount; index++) {
      y = parseInt(
        radius + (radius * Math.sin(index * 2 * (Math.PI / dotcount)) + 0.5)
      );
      x = parseInt(
        radius + (radius * Math.cos(index * 2 * (Math.PI / dotcount)) + 0.5)
      );
      if (xlast !== x || ylast !== y) {
        xlast = x;
        ylast = y;
      }
      stack.push({ x: x, y: y, size: dotsize, index: index });
    }
    return stack;
  }

  componentDidMount() {
    const { dots, count } = this.state;
    const { countDownSecond } = this.props;

    const countDownMilliSeconds = countDownSecond * 1000;
    const tickIntervalTime = countDownMilliSeconds / dots.length;
    let tickIndex = 0;

    setTimeout(() => {
      const startTime = new Date().getTime();
      const endTime = startTime + countDownMilliSeconds;

      this.tickInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const remaininSecond = Math.round((endTime - currentTime) / 1000);
        tickIndex = this.tick(tickIndex, remaininSecond);
      }, tickIntervalTime);
    }, 900);
  }

  tick(tickIndex, remaininSecond) {
    const { dots } = this.state;
    const _dots = [...dots];
    let GB = 255 - tickIndex * (255 / dots.length + 5);
    GB = GB > 255 ? 255 : GB;
    _dots[tickIndex] = {
      ..._dots[tickIndex],
      style: {
        animation: `${DotTick({
          backgroundColor: `rgb(255, ${GB}, ${GB})`,
          transform: "scale(1.2)",
          opacity: "1"
        })} .3s cubic-bezier(0, 1.9, 1, 1.28) forwards`
      }
    };

    this.setState({ dots: _dots, countDown: remaininSecond }, () => {
      tickIndex++;
    });

    if (tickIndex === dots.length) {
      this.setState({ end: true }, () => this.end());
      clearInterval(this.tickInterval);
    }
    return tickIndex;
  }

  end = () => {
    this.props.onEnd();
  };

  render() {
    const { dots, countDown, end } = this.state;
    const { dotsize, size, countDownSecond } = this.props;
    return (
      <Container>
        <Wrapper>
          {end && (
            <EndWrapper>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 190 145"
                width="190"
                height="145"
              >
                <EndCheck
                  d="M166.22 12.47L55.97 110.31L11.13 68.96"
                  id="a2lHgfwEx"
                />
              </svg>
            </EndWrapper>
          )}
          {new Array(countDownSecond + 1).fill("").map((second, index) => {
            return (
              !end && (
                <CountDownSecond
                  size={size}
                  animate={index !== 3}
                  show={countDown === index}
                  key={index}
                >
                  {index}
                </CountDownSecond>
              )
            );
          })}
          <DotCircleWrapper size={size}>
            {dots.map((dot, index) => {
              const style = {
                left: dot.x + "px",
                top: dot.y + "px",
                animation: `${DotIn} 15ms ease ${index * 15}ms forwards`
              };
              return (
                <Dot
                  key={index}
                  end={end}
                  index={index}
                  style={{ ...style, ...dot.style }}
                  size={dotsize}
                  ticked={dot.style}
                />
              );
            })}
          </DotCircleWrapper>
        </Wrapper>
      </Container>
    );
  }
}

CountDown.propTypes = {
  size: PropTypes.number,
  dotsize: PropTypes.number,
  dotcount: PropTypes.number,
  countDownSecond: PropTypes.number,
  onEnd: PropTypes.func
};

CountDown.defaultProps = {
  onEnd: () => {},
  size: 340,
  dotsize: 10,
  dotcount: 60,
  countDownSecond: 3
};

export default CountDown;
