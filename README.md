# Philips Hue Control Panel

Control your Philips Hue smart lights from your PC.

You will need to know the local IP address of your Philips Hue bridge and developer username in order to use this app. See [here](https://developers.meethue.com/develop/get-started) for help with this.

Download the [latest Electron desktop release](https://github.com/cdleveille/phue/releases/latest) (supports Windows, Mac, and Linux) or [check out the browser version on Vercel](https://phue.vercel.app/).

## Security

If you see an `ERR_CERT_AUTHORITY_INVALID` error in your browser when trying to connect to your bridge, click the "Advanced" button, and then "Proceed to <Bridge_IP_Address>". Though it is completely safe to use (assuming you are simply allowing it to connect to the bridge on your own home network), the browser blocks the response from the bridge by default because Philips Hue bridges do not provide an SSL certificate in the V1 API.

This is not an issue in the Electron desktop versions of the app, as it has been suppressed by appending the `ignore-certificate-errors` switch to the Chromium command line.

SSL certificates *are* provided in the V2 API, but it currently has other issues of its own (notably, not sending any CORS headers in its responses) that Philips will need to fix before I can update this app to use it instead.
