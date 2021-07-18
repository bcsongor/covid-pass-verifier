# 🦠 COVID Pass Verifier [![License](https://img.shields.io/github/license/bcsongor/covid-pass-verifier?style=plastic)](https://opensource.org/licenses/Apache-2.0) [![GitHub issues](https://img.shields.io/github/issues/bcsongor/covid-pass-verifier?style=plastic)](https://github.com/bcsongor/covid-pass-verifier/issues)

> Scan, parse and verify HCERT compliant government-issued COVID-19 passes.

Compatible with EU Digital COVID Certificates 🇪🇺 and NHS COVID Passes 🇬🇧.

All processing (including scanning, parsing and verification) happens on the local device and no data is sent to external servers.

## Usage

Use a device that either has a built-in camera (e.g. smartphone) or has an external camera attached (e.g. desktop with webcam).

### Steps

1. Navigate to https://covid-pass-verifier.com/
2. Click on _Scan QR Code_
3. Scan the COVID pass QR code
4. If the COVID pass is
    - *valid*: a badge and a table will be displayed with the vaccination status and details
    - *invalid*: an error badge will be displayed

### Supported platforms

| Platform                             |    |
|--------------------------------------|----|
| Desktop (Chrome, Safari, Edge, etc.) | ✔  |
| iOS Safari                           | ✔  |
| iPadOS Safari                        | ✔  |
| Android                              | ✔  |

### Supported certificates

See [docs/Certificates.md](docs/Certificates.md) for the list government-issued certificates currently supported by COVID Pass Verifier.

## Development

### Available scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn lint`

Runs the linger against the code-base found under the `src` folder.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

#### `yarn deploy`

Deploys the linted and built application to Microsoft Azure.\
This requires certain access tokens and keys which can be set in the `.env` file.

#### `yarn update-certificates`

Updates the certificates used in the web application to verify the signature of the CBOR Web Tokens.

This currently fetches the EU certificates from the Austrian government and enriches the data with a 3rd party source containing the UK certificates.

Certificates currently used by the web app: https://covid-pass-verifier.com/assets/certificates.json

#### `yarn build-certificate-list`

Builds a Markdown document that lists the currently supported certificates.\
See output at [docs/Certificates.md](docs/Certificates.md).