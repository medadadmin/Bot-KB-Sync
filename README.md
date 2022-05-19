# Bot-KB-Sync

## Introduction

Set of dev scripts to help deploy and sync Botpress and Wit.ai

## Requirements

Make sure they are installed correctly and running on your environment.

[node](https://nodejs.org/en/) - version 14 or newer\
[git](https://git-scm.com/) - version 2.22 or newer

## Setup

1-Clone this repo into your environment.
```
git clone <repo_url>
```
4-Navigate to cloned directory.
```
cd <path>
```
3-Install dependencies.
```
npm install
```

## Usage

### Upload from excel to botpress

```
npm run deploy -- --api=${botpress_api_url} --email=${botpress_admin_email} --password=${botpress_admin_password} --bot=${botpress_bot_name} --file=../${xlsx_file_path_relative_to_src} --clear=${true/false}
```

* Botpress api url will be something like this "https://vlachatbot.medadstg.com/api/v1"
* Template for the expected Excel file can be found in templates directory

### Upload from json to wit

```
npm run wit -- --token=${wit_bot_server_token} --file=../../${xlsx_file_path_relative_to_src}
```

* The json file used is the same as qna exported from botpress
