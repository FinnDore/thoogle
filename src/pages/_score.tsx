import { scaleLinear } from "@visx/scale";

const scale = scaleLinear({
    domain: [0, 1],
    range: ["#ff0000", "#00ff00"],
});

const Score = ({ value }: { value: number }) => (
    <div
        style={{
            color: scale(value),
        }}
    >
        {" "}
        score: {value}
    </div>
);

export default Score;
