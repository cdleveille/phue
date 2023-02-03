import NextHead from "next/head";

const Head = () => {
	return (
		<NextHead>
			<title>Philips Hue Control Panel</title>
			<meta name="description" content="Control your Philips Hue smart lights from the browser." />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="phue.svg" />
		</NextHead>
	);
};

export default Head;
