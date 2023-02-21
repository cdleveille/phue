import { useEffect, useState } from "react";

import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import { useLights } from "../hooks/useLights";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
	API_URL_LOCAL_STORAGE_KEY,
	BRIDGE_IP_OPTIONS_LOCAL_STORAGE_KEY,
	USERNAME_OPTIONS_LOCAL_STORAGE_KEY
} from "../types/constants";

interface IAuthProps {
	setApiUrl: (url: string) => void;
}

const Auth = ({ setApiUrl }: IAuthProps) => {
	const [bridgeIpAddress, setBridgeIpAddress] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [bridgeIps, setBridgeIps] = useState([] as string[]);
	const [usernames, setUsernames] = useState([] as string[]);

	const { ping } = useLights();
	const { getLocalStorageItem, setLocalStorageItem } = useLocalStorage();

	useEffect(() => {
		const localStorageBridgeIps = getLocalStorageItem<string[]>(BRIDGE_IP_OPTIONS_LOCAL_STORAGE_KEY) || [];
		const localStorageUsernames = getLocalStorageItem<string[]>(USERNAME_OPTIONS_LOCAL_STORAGE_KEY) || [];

		if (localStorageBridgeIps[0] && !bridgeIpAddress) {
			setBridgeIpAddress(localStorageBridgeIps[0]);
		}

		if (localStorageUsernames[0] && !username) {
			setUsername(localStorageUsernames[0]);
		}

		setBridgeIps(localStorageBridgeIps);
		setUsernames(localStorageUsernames);
	}, []);

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
					<Autocomplete
						sx={{
							width: "300px",
							border: "solid #c4c4c4 2px",
							borderRadius: "5px",
							input: { color: "#c4c4c4" }
						}}
						freeSolo
						value={bridgeIpAddress}
						onInputChange={(_e: React.SyntheticEvent, value: string) => setBridgeIpAddress(value)}
						options={bridgeIps.sort()}
						renderInput={params => <TextField {...params} />}
						ListboxProps={{
							style: { backgroundColor: "#252526", color: "#c4c4c4" }
						}}
					/>
					<div style={{ paddingTop: "2rem", paddingBottom: "0.25rem" }}>Username:</div>
					<Autocomplete
						sx={{
							width: "300px",
							border: "solid #c4c4c4 2px",
							borderRadius: "5px",
							input: { color: "#c4c4c4" }
						}}
						freeSolo
						value={username}
						onInputChange={(_e: React.SyntheticEvent, value: string) => setUsername(value)}
						options={usernames.sort()}
						renderInput={params => <TextField {...params} />}
						ListboxProps={{
							style: { backgroundColor: "#252526", color: "#c4c4c4" }
						}}
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
										setError("");
										if (!bridgeIpAddress || !username) {
											setError("Both fields are required");
											return;
										}
										const url = `https://${bridgeIpAddress}/api/${username}`;
										setIsLoading(true);
										const res = await ping(url);
										if (res[0]?.error?.description) {
											const { description } = res[0].error;
											setError(description.charAt(0).toUpperCase() + description.slice(1));
											setIsLoading(false);
											return;
										}
										setLocalStorageItem(API_URL_LOCAL_STORAGE_KEY, url);
										if (!bridgeIps.includes(bridgeIpAddress)) {
											setLocalStorageItem(BRIDGE_IP_OPTIONS_LOCAL_STORAGE_KEY, [
												...bridgeIps,
												bridgeIpAddress
											]);
										}
										if (!usernames.includes(username)) {
											setLocalStorageItem(USERNAME_OPTIONS_LOCAL_STORAGE_KEY, [
												...usernames,
												username
											]);
										}
										setApiUrl(url);
										setIsLoading(false);
									} catch (error) {
										setError("Error connecting to bridge");
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
