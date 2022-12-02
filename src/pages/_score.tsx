import { scaleLinear } from "@visx/scale";

const scale = scaleLinear({
    domain: [0, 1],
    range: ["#fc035e", "#ff0", "#00ff00"],
});

const Score = ({ value }: { value: number }) => (
    <div
        style={{
            color: scale(value),
        }}
    >
        {" "}
        score: {(+value?.toPrecision(2) * 100).toPrecision(2)}
    </div>
);

export default Score;
