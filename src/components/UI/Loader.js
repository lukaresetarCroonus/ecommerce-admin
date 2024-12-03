import { jsx, css, keyframes } from "@emotion/react";
import Box from "@mui/material/Box";

const PauseBox = () => (
    <Box
        css={css`
            display: block;
            background: rgba(0, 0, 0, 0.66) no-repeat 0 0;
            width: 100%;
            height: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 1000;
        `}
    />
);

const frames = keyframes`
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(359deg);
    transform: rotate(359deg);
  }
`;

const SpinnerBox = () => (
    <Box
        css={css`
            -webkit-animation: ${frames} 1s infinite linear;
            animation: ${frames} 1s infinite linear;
            background: transparent;
            border: 1vw solid #ffffff;
            border-radius: 100%;
            border-top-color: var(--main-color);
            width: 5vw;
            height: 5vw;
            opacity: 1;
            padding: 0;
            position: absolute;
            z-index: 999;
        `}
    />
);

const Loader = () => {
    return (
        <PauseBox>
            <SpinnerBox />
        </PauseBox>
    );
};

export default Loader;
