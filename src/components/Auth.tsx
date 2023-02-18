import { useState } from "react";
import { isMobile } from "react-device-detect";

import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import { LOCAL_STORAGE_KEY } from "../types/constants";

interface IAuthProps {
	setLocalStorageItem: (key: string, data: any) => void;
	setApiUrl: (url: string) => void;
	ping: (apiUrl: string) => Promise<any>;
}

const Auth = ({ setLocalStorageItem, setApiUrl, ping }: IAuthProps) => {
	const [bridgeIpAddress, setBridgeIpAddress] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div className="auth">
			<div style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
				<div className="help-btn">
					<a href="https://developers.meethue.com/develop/get-started" target="_blank" rel="noreferrer">
						<IconButton sx={{ color: "#c4c4c4", border: "2px solid #c4c4c4" }} size="small">
							<QuestionMarkIcon />
						</IconButton>
					</a>
				</div>
				<form>
					<div style={{ paddingBottom: "0.25rem" }}>Bridge IP:</div>
					<TextField
						value={bridgeIpAddress}
						sx={{ border: "solid #c4c4c4 2px", borderRadius: "5px", input: { color: "#c4c4c4" } }}
						onChange={e => setBridgeIpAddress(e.target.value)}
						autoFocus={!isMobile}
						spellCheck={false}
						inputProps={{
							autoCapitalize: "none",
							autoComplete: "none"
						}}
						autoCapitalize="none"
						autoComplete="none"
						color="info"
						type="url"
					/>
					<div style={{ paddingTop: "2rem", paddingBottom: "0.25rem" }}>Username:</div>
					<TextField
						value={username}
						sx={{ border: "solid #c4c4c4 2px", borderRadius: "5px", input: { color: "#c4c4c4" } }}
						onChange={e => setUsername(e.target.value)}
						spellCheck={false}
						inputProps={{
							autoCapitalize: "none",
							autoComplete: "none"
						}}
						autoCapitalize="none"
						autoComplete="none"
						color="info"
						type="text"
					/>
					{error && <div className="error">{error}</div>}
					<div style={{ paddingTop: "2rem" }}>
						{!isLoading ? (
							<Button
								variant="outlined"
								type="submit"
								onClick={async e => {
									try {
										e.preventDefault();
										if (!bridgeIpAddress || !username) {
											setError("Both fields are required.");
											return;
										}
										const url = `https://${bridgeIpAddress}/api/${username}`;
										setIsLoading(true);
										const res = await ping(url);
										console.log(res);
										if (res[0]?.error?.description) {
											const { description } = res[0].error;
											setError(description.charAt(0).toUpperCase() + description.slice(1) + ".");
											setIsLoading(false);
											return;
										}
										setLocalStorageItem(LOCAL_STORAGE_KEY, url);
										setApiUrl(url);
										setIsLoading(false);
									} catch (error) {
										console.error(error);
										setError("Error connecting to bridge.");
										setIsLoading(false);
									}
								}}
							>
								OK
							</Button>
						) : (
							<CircularProgress />
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

export default Auth;
