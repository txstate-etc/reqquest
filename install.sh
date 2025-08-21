#!/bin/bash
cd api; npm ci; cd ../ui; npm ci; cd ../test; npm i; cd ../testserver; npm ci
