#!/usr/bin/env bash

cd tuner;
make;
cd ../react;
npm run build;
npm run deploy;
