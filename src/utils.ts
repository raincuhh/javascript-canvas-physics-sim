export const getRandomHSLColor = () => {
	return `hsl(${Math.random() * 360}, 100%, 50%)`;
};

const colors = [
	"#FF5733",
	"#33FF57",
	"#3357FF",
	"#FF33A1",
	"#FFD700",
	"#00CED1",
	"#FF4500",
	"#8A2BE2",
	"#20B2AA",
	"#DC143C",
	"#FF8C00",
	"#32CD32",
];

export const getRandomHexColor = () => colors[Math.floor(Math.random() * colors.length)];
