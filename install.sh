#!/bin/bash
cd api; npm ci; cd ../ui; npm ci; cd ../test; npm ci; cd ../demos; npm ci
